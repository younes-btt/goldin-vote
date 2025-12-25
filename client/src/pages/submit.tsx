import { useState, useRef } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTranslation } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Crown, CheckCircle, ArrowLeft, Upload, Camera, X } from "lucide-react";
import type { Student } from "@shared/schema";

const submitSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(200, "Description must be under 200 characters").optional(),
});

type SubmitForm = z.infer<typeof submitSchema>;

export default function Submit() {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedStudent, setSubmittedStudent] = useState<Student | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SubmitForm>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: t('fileTooLarge'),
        description: t('fileTooLargeDesc'),
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type || "image/jpeg",
        }),
      });

      if (!response.ok) throw new Error("Failed to get upload URL");

      const { uploadURL, objectPath } = await response.json();

      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "image/jpeg" },
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload file");

      setPhotoUrl(objectPath);
      toast({
        title: t('photoUploaded'),
        description: t('photoUploadedDesc'),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('uploadFailed'),
        description: t('tryAgain'),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitForm) => {
      const response = await apiRequest("POST", "/api/students", {
        name: data.name,
        description: data.description || null,
        photoUrl: photoUrl,
        isActive: true,
      });
      return response as Student;
    },
    onSuccess: (student) => {
      setSubmittedStudent(student);
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: t('entrySubmitted'),
        description: t('entrySubmittedDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('submissionFailed'),
        description: error.message || t('tryAgain'),
      });
    },
  });

  const onSubmit = (data: SubmitForm) => {
    submitMutation.mutate(data);
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isSubmitted && submittedStudent) {
    return (
      <div className={`min-h-screen bg-background particles-bg flex items-center justify-center p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <Card className="w-full max-w-md bg-card border-primary/30">
          <CardContent className="pt-10 pb-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-3 text-foreground">
              {t('entrySubmitted')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('entrySubmittedDesc')}
            </p>
            
            <Card className="bg-muted/50 border-primary/20 p-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full ring-2 ring-primary/50 overflow-hidden">
                  <Avatar className="w-full h-full">
                    {submittedStudent.photoUrl && (
                      <AvatarImage src={submittedStudent.photoUrl} alt={submittedStudent.name} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(submittedStudent.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <h3 className="font-semibold text-foreground">{submittedStudent.name}</h3>
                  {submittedStudent.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {submittedStudent.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Link href="/leaderboard">
                <Button size="lg" className="w-full font-semibold" data-testid="button-view-leaderboard">
                  {t('viewLeaderboard')}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full font-semibold border-primary/30" data-testid="button-back-home">
                  {t('backToHome')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background particles-bg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="border-b border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
                <Crown className="w-6 h-6 text-primary" />
                <span className="font-semibold text-foreground">{t('appName')}</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="button-back-home">
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                  {t('back')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              <span className="gold-gradient-text">{t('submitTitle')}</span>
            </h1>
            <p className="text-muted-foreground">
              {t('submitSubtitle')}
            </p>
          </div>

          <Card className="bg-card border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-foreground">{t('studentEntryForm')}</CardTitle>
              <CardDescription>
                {t('studentFormDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">{t('fullNameRequired')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('enterFullName')}
                            className="bg-background border-primary/30 focus:border-primary"
                            data-testid="input-student-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">{t('shortDescription')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('descriptionPlaceholder')}
                            className="bg-background border-primary/30 focus:border-primary resize-none"
                            rows={3}
                            data-testid="input-student-description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel className="text-foreground">{t('photo')}</FormLabel>
                    <div className="flex flex-col items-center gap-4">
                      {photoUrl ? (
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary">
                            <img
                              src={photoUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6"
                            onClick={() => setPhotoUrl(null)}
                            data-testid="button-remove-photo"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="w-full border-2 border-dashed border-primary/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                          data-testid="button-upload-photo"
                        >
                          <Camera className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground mb-1">
                            {t('clickToUpload')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('photoFormats')}
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file);
                        }}
                        data-testid="input-photo-file"
                      />
                      {isUploading && (
                        <p className="text-sm text-muted-foreground animate-pulse">
                          {t('loading')}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold"
                    disabled={submitMutation.isPending || isUploading}
                    data-testid="button-submit-entry"
                  >
                    {submitMutation.isPending ? (
                      <span className="animate-pulse">{t('submitting')}</span>
                    ) : (
                      <>
                        <Upload className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('submitEntryButton')}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
