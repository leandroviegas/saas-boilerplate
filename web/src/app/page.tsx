'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  Globe, 
  CreditCard, 
  Users, 
  Building2, 
  Key, 
  Bell,
  Database,
  MessageSquare,
  Palette,
  Code2,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

const features = [
  {
    icon: Key,
    title: 'Authentication',
    description: 'Secure email/password auth with 2FA support, session management, and password reset flows.',
    tags: ['2FA', 'Sessions', 'Password Reset']
  },
  {
    icon: Shield,
    title: 'RBAC System',
    description: 'Granular role-based access control with permissions, organization roles, and resource scoping.',
    tags: ['Roles', 'Permissions', 'Organizations']
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Full Stripe integration for subscriptions, products, pricing tiers, and coupon management.',
    tags: ['Stripe', 'Subscriptions', 'Coupons']
  },
  {
    icon: Globe,
    title: 'Internationalization',
    description: 'Multi-language support with server-side translations and runtime language switching.',
    tags: ['i18n', 'Server Translations', 'RTL']
  },
  {
    icon: Building2,
    title: 'Multi-tenancy',
    description: 'Organization-based multi-tenancy with scoped data isolation and team management.',
    tags: ['Organizations', 'Teams', 'Isolation']
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Real-time notifications via WebSockets with notification management and preferences.',
    tags: ['WebSockets', 'Real-time', 'Preferences']
  }
]

const techStack = [
  { name: 'Next.js 15', icon: '🚀' },
  { name: 'React 19', icon: '⚛️' },
  { name: 'ElysiaJS', icon: '🔥' },
  { name: 'Prisma', icon: '📊' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Stripe', icon: '💳' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'WebSockets', icon: '🔌' }
]

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10)
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50"
      >
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-b border-border/40 bg-background/80 backdrop-blur-xl"
            />
          )}
        </AnimatePresence>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg">SaaS Boilerplate</span>
          </motion.div>
          <div className="flex items-center gap-6">
            <motion.a 
              href="#features" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#tech" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2 }}
            >
              Tech Stack
            </motion.a>
            <motion.button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="w-5 h-5" />
              </motion.div>
              <motion.div
                className="absolute top-2 left-2"
                animate={{ rotate: theme === 'dark' ? 0 : -180, scale: theme === 'dark' ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className="w-5 h-5" />
              </motion.div>
            </motion.button>
            <Link 
              href="/auth"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/auth?signup=true"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Production-ready starter kit
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Build your SaaS faster with{' '}
              <motion.span 
                className="text-primary"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundImage: 'linear-gradient(90deg, var(--primary), var(--primary-foreground), var(--primary))', backgroundSize: '200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                confidence
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              A production-ready boilerplate with authentication, payments, RBAC, 
              multi-tenancy, and more. Focus on your product, not the infrastructure.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/auth?signup=true"
                  className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Start Building
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-xl border border-border hover:bg-secondary/50 transition-colors"
                >
                  Explore Features
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-2 text-xs text-muted-foreground">api/src/routes.ts</span>
              </div>
              <pre className="p-6 text-sm overflow-x-auto">
                <code className="text-foreground">
{`import { Elysia } from 'elysia'
import { authController } from './controllers/auth.controller'
import { productController } from './controllers/product.controller'

const app = new Elysia()
  .use(authController)
  .use(productController)
  .use(permissionMiddleware)
  .listen(3000)

console.log(\`🦊 Elysia running at \${app.server?.hostname}\`)
`}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 border-y border-border/40"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '15+', label: 'Pre-built Features' },
              { value: '100%', label: 'TypeScript' },
              { value: '∞', label: 'Customizable' },
              { value: '1min', label: 'Setup Time' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything you need to ship</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive set of features built with best practices and modern patterns.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag, j) => (
                    <span 
                      key={j}
                      className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <AnimatePresence>
                  {hoveredFeature === i && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Built with modern tech</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Using the latest and most reliable technologies for production workloads.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <span className="text-2xl">{tech.icon}</span>
                <span className="font-medium">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API & Database Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Full-stack TypeScript</h2>
              <p className="text-lg text-muted-foreground mb-8">
                From database to frontend, everything is TypeScript. Enjoy type safety 
                across your entire application with shared models and validation schemas.
              </p>
              <div className="space-y-4">
                {[
                  'Type-safe API routes with ElysiaJS',
                  'Prisma ORM with PostgreSQL',
                  'Shared TypeScript types between frontend and backend',
                  'Server-side rendering with Next.js App Router'
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <Database className="w-8 h-8 text-primary mb-2" />
                    <div className="font-medium">Database</div>
                    <div className="text-sm text-muted-foreground">Prisma + PostgreSQL</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <Code2 className="w-8 h-8 text-primary mb-2" />
                    <div className="font-medium">API</div>
                    <div className="text-sm text-muted-foreground">ElysiaJS + tRPC-like</div>
                  </motion.div>
                </div>
                <div className="space-y-4 pt-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <Palette className="w-8 h-8 text-primary mb-2" />
                    <div className="font-medium">UI</div>
                    <div className="text-sm text-muted-foreground">shadcn/ui + Tailwind</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <MessageSquare className="w-8 h-8 text-primary mb-2" />
                    <div className="font-medium">Real-time</div>
                    <div className="text-sm text-muted-foreground">WebSockets</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"></div>
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to build?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Start your next SaaS project with a production-ready foundation. 
                Save weeks of development time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/auth?signup=true"
                    className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a 
                    href="#features"
                    className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-xl border border-border hover:bg-secondary/50 transition-colors"
                  >
                    View Documentation
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 px-6 border-t border-border/40"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">S</span>
              </div>
              <span className="font-medium">SaaS Boilerplate</span>
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, ElysiaJS, and Stripe
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}