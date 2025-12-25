import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Vote, Users, Award, ArrowRight, Star, Crown } from "lucide-react";
import { useTranslation } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  const { t, isRTL } = useTranslation();
  
  return (
    <div className={`min-h-screen bg-background particles-bg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gold accent lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* School badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('appName')}</span>
            </div>

            {/* Main heading */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gold-gradient-text">{t('heroTitle')}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/vote">
                <Button size="lg" className="min-w-[200px] text-base font-semibold" data-testid="button-vote-now">
                  <Vote className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('registerToVote')}
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" size="lg" className="min-w-[200px] text-base font-semibold border-primary/50 text-foreground" data-testid="button-view-leaderboard">
                  <Trophy className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('viewResults')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gold circles */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              <span className="gold-gradient-text">{t('featuresTitle')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <Card className="p-8 bg-card border-primary/20 gold-border-glow transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{t('feature1Title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('feature1Desc')}
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 bg-card border-primary/20 gold-border-glow transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Vote className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{t('feature2Title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('feature2Desc')}
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 bg-card border-primary/20 gold-border-glow transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{t('feature3Title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('feature3Desc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto p-10 md:p-16 bg-gradient-to-br from-card to-card/50 border-primary/30 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-primary trophy-animation" />
                <Award className="w-6 h-6 text-primary" />
                <Star className="w-5 h-5 text-primary trophy-animation" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="min-w-[180px] text-base font-semibold" data-testid="button-register-voter">
                    {t('registerToVote')}
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </Link>
                <Link href="/submit">
                  <Button variant="outline" size="lg" className="min-w-[180px] text-base font-semibold border-primary/50 text-foreground" data-testid="button-submit-entry">
                    {t('submitEntry')}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">{t('appName')}</span>
            </div>
            <nav className="flex flex-wrap items-center gap-6">
              <Link href="/vote" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-vote">{t('feature2Title')}</Link>
              <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-leaderboard">{t('viewResults')}</Link>
              <Link href="/submit" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-submit">{t('submitEntry')}</Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-admin">{t('adminLogin')}</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
