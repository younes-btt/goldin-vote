# 20 August High School Voting Platform - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from The Webby Awards and Product Hunt for elegant presentation and clear voting mechanics. Premium award ceremony aesthetic with modern voting interface patterns.

## Color System
- **Primary Black**: #000000 (pure black) - Main backgrounds, primary text
- **Gold**: #FFD700 - Primary accents, highlights, CTAs
- **Darker Gold**: #FFA500 - Secondary accents, borders
- **Charcoal**: #1A1A1A - Card backgrounds, sections
- **White**: #FFFFFF - Body text, contrast elements
- **Bright Gold**: #FFED4E - Hover states, active elements, vote counts

## Typography
- **Headings**: Playfair Display (serif, elegant) - Challenge titles, winner announcements
- **UI Elements**: Montserrat (sans-serif, modern) - Buttons, labels, navigation
- **Body Text**: Inter (readable) - Descriptions, voting instructions
- **Weights**: 400 (regular), 600 (semi-bold), 700 (bold)

## Layout System
**Spacing**: Consistent 24px base unit (Tailwind: p-6, gap-6, mb-6)
- Card padding: 32px (p-8)
- Section spacing: 48px vertical (py-12)
- Container max-width: 1280px (max-w-7xl)

## Core Components

### Public Voting Interface
**Hero Section**: Full-width banner with gold gradient overlay on dark background
- Challenge title (Playfair Display, 48px)
- Countdown timer to voting deadline
- Current vote count display
- Gold accent line separators

**Student Cards Grid**: 3-column on desktop, 1-column mobile
- Card background: #1A1A1A with subtle gold border (1px #FFA500)
- Student photo/avatar (circular, gold ring)
- Name (Montserrat, 24px)
- Vote count (Bright gold #FFED4E, prominent)
- Vote button (Gold background, black text, hover: brightness effect)
- Spacing between cards: 24px

**Leaderboard Display**: Ranked list with visual hierarchy
- Top 3 highlighted with gold trophy icons
- Real-time vote updates with smooth transitions
- Progress bars showing vote percentages (gold fill)

### Voter Registration
**Simple Form**: Single card centered layout
- Name and email fields only
- Large gold "Register to Vote" button
- Confirmation message with gold checkmark
- Auto-redirect to voting after registration

### Student Submission Portal
**Upload Form**: Clean, step-by-step interface
- Photo/avatar upload with preview
- Name and details fields
- Submit button (gold, prominent)
- Success confirmation screen

### Admin Dashboard
**Private Access**: Clean data visualization
- Login screen (black background, gold accents)
- Real-time vote tallies in table format
- Export results button
- Manage participants section
- Dark theme with gold highlights for data points

## Visual Elements
- **Borders**: 1px gold (#FFA500) for cards and containers
- **Shadows**: Subtle gold glow on hover (0 0 20px rgba(255, 215, 0, 0.2))
- **Icons**: Gold trophy, checkmarks, voting icons
- **Dividers**: Thin gold lines (1px) for section separation

## Interactions
- Button hover: Brightness increase, no blur backgrounds needed
- Card hover: Subtle gold border glow
- Vote button: Scale slightly on click (0.95)
- Real-time vote updates: Fade-in animation for count changes

## Images
**Hero Background**: Abstract gold particles/confetti on dark background (or solid black with gold accent pattern)
- Placement: Full-width header section
- Overlay: Dark gradient to ensure text readability
- Note: No large hero image required - focus on elegant typography and gold accents

## Mobile Responsiveness
- Cards stack to single column
- Typography scales down 20% on mobile
- Touch-friendly buttons (minimum 48px height)
- Simplified navigation

## Brand Identity
Premium, prestigious feel reflecting award ceremony aesthetics. Every element reinforces excellence and competition through sophisticated gold-on-black design. No example data or placeholders - launch-ready from deployment.