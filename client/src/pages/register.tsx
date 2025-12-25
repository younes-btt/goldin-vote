import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useVoterStore } from "@/lib/auth";
import { useTranslation } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Crown, CheckCircle, ArrowLeft, Vote } from "lucide-react";
import type { Voter } from "@shared/schema";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setVoter } = useVoterStore();
  const { t, isRTL } = useTranslation();
  const [isRegistered, setIsRegistered] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const response = await apiRequest("POST", "/api/voters", data);
      return response as Voter;
    },
    onSuccess: (voter) => {
      setVoter(voter);
      setIsRegistered(true);
      toast({
        title: t('registrationSuccess'),
        description: t('registrationSuccessDesc'),
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

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  if (isRegistered) {
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
              {t('registrationSuccess')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('registrationSuccessDesc')}
            </p>
            <Link href="/vote">
              <Button size="lg" className="min-w-[180px] font-semibold" data-testid="button-go-to-vote">
                <Vote className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('voteNow')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background particles-bg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              <span className="gold-gradient-text">{t('registerTitle')}</span>
            </h1>
            <p className="text-muted-foreground">
              {t('registerSubtitle')}
            </p>
          </div>

          <Card className="bg-card border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-foreground">{t('voterRegistration')}</CardTitle>
              <CardDescription>
                {t('voterRegisterDesc')}
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
                        <FormLabel className="text-foreground">{t('fullName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('enterFullName')}
                            className="bg-background border-primary/30 focus:border-primary"
                            data-testid="input-voter-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">{t('email')}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t('enterEmail')}
                            className="bg-background border-primary/30 focus:border-primary"
                            data-testid="input-voter-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold"
                    disabled={registerMutation.isPending}
                    data-testid="button-submit-registration"
                  >
                    {registerMutation.isPending ? (
                      <span className="animate-pulse">{t('registering')}</span>
                    ) : (
                      <>
                        <Vote className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('registerButton')}
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 pt-6 border-t border-primary/20 text-center">
                <p className="text-sm text-muted-foreground">
                  {t('alreadyRegistered')}{" "}
                  <Link href="/vote" className="text-primary hover:underline" data-testid="link-login-vote">
                    {t('loginHere')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
