"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import {
  Stack,
  FormControl,
  Input,
  Textarea,
  Button,
  Cluster,
  NotificationBar,
  Select,
  StatusLabel,
} from "smarthr-ui";
import { CREATE_ARTICLE, UPDATE_ARTICLE } from "@/lib/queries/article";
import Link from "next/link";

const articleSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  body: z.string().min(1, "本文は必須です"),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

type Props = {
  articleId?: string;
  lockVersion?: number;
  defaultValues?: Partial<ArticleFormValues>;
};

const requiredLabel = <StatusLabel key="required" type="red">必須</StatusLabel>;

const STATUS_OPTIONS = [
  { value: "draft" as const, label: "下書き" },
  { value: "published" as const, label: "公開済み" },
  { value: "archived" as const, label: "アーカイブ" },
];

export function ArticleForm({ articleId, lockVersion, defaultValues }: Props) {
  const router = useRouter();
  const isEditing = !!articleId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: defaultValues ?? { status: "draft" },
  });

  const [createArticle] = useMutation(CREATE_ARTICLE);
  const [updateArticle] = useMutation(UPDATE_ARTICLE);

  const handleMutationErrors = (mutationErrors?: string[] | null) => {
    if (mutationErrors && mutationErrors.length > 0) {
      setError("root", { message: mutationErrors[0] });
      return true;
    }
    return false;
  };

  const onSubmit = async (values: ArticleFormValues) => {
    if (isEditing) {
      const { data } = await updateArticle({
        variables: {
          id: articleId,
          title: values.title,
          body: values.body,
          status: values.status,
          lockVersion: lockVersion,
        },
      });
      if (handleMutationErrors(data?.updateArticle?.errors)) return;
      router.push(`/articles/${articleId}`);
      router.refresh();
    } else {
      const { data } = await createArticle({
        variables: {
          title: values.title,
          body: values.body,
        },
      });
      if (handleMutationErrors(data?.createArticle?.errors)) return;
      router.push(`/articles/${data?.createArticle?.article?.id}`);
    }
  };

  const backHref = isEditing ? `/articles/${articleId}` : "/articles";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="L">
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {errors.root && (
            <NotificationBar type="error">
              {errors.root.message}
            </NotificationBar>
          )}
        </div>

        <FormControl
          label={{ text: "タイトル", htmlFor: "title" }}
          statusLabels={requiredLabel}
          errorMessages={errors.title?.message}
        >
          <Input
            id="title"
            {...register("title")}
            error={!!errors.title}
            width="100%"
          />
        </FormControl>

        <FormControl
          label={{ text: "本文", htmlFor: "body" }}
          statusLabels={requiredLabel}
          errorMessages={errors.body?.message}
        >
          <Textarea
            id="body"
            {...register("body")}
            error={!!errors.body}
            width="100%"
            rows={10}
          />
        </FormControl>

        {isEditing && (
          <FormControl label={{ text: "ステータス", htmlFor: "status" }}>
            <Select
              id="status"
              {...register("status")}
              options={STATUS_OPTIONS}
              width="200px"
            />
          </FormControl>
        )}

        <Cluster gap="M">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditing ? "更新する" : "作成する"}
          </Button>
          <Link href={backHref}>
            <Button type="button" variant="secondary">
              キャンセル
            </Button>
          </Link>
        </Cluster>
      </Stack>
    </form>
  );
}
