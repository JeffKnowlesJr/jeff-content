# Archived Futuristic Image Effects

This document archives the futuristic tech-themed image effects previously used on the profile images in the portfolio website.

## Background

These effects were created to give a high-tech, futuristic appearance to profile images with animated elements including:

- Glowing circuit lines
- Tech corner overlays with pulsing effects
- Scanner effects
- Hexagon patterns
- Digital circuit patterns
- Animated tech dots
- Pulsing borders

## JSX Implementation

```jsx
{/* Animated circuit lines */}
<div className='absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-70'>
  <div className='absolute top-0 left-1/4 w-[1px] h-[70%] bg-primary animate-[glow_4s_ease-in-out_infinite]'></div>
  <div className='absolute top-1/4 left-0 w-[40%] h-[1px] bg-primary-light animate-[glow_3s_ease-in-out_infinite]'></div>
  <div className='absolute bottom-1/3 right-0 w-[30%] h-[1px] bg-secondary-light animate-[glow_5s_ease-in-out_infinite_0.5s]'></div>
  <div className='absolute bottom-0 right-1/3 w-[1px] h-[40%] bg-secondary animate-[glow_4.5s_ease-in-out_infinite_1s]'></div>
</div>

{/* Tech corner overlays with pulsing effect */}
<div className='absolute top-0 right-0 w-20 h-20 z-10'>
  <div className='absolute inset-0 bg-gradient-to-bl from-primary/30 to-transparent'></div>
  <div className='absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-primary-light rounded-bl-lg opacity-80 animate-pulse'></div>
  <div className='absolute top-2 right-2 w-3 h-3 bg-primary-light rounded-full animate-ping'></div>

  {/* Tech dots */}
  <div className='absolute top-4 right-8 w-1.5 h-1.5 bg-primary-light rounded-full opacity-80'></div>
  <div className='absolute top-8 right-4 w-1.5 h-1.5 bg-primary-light rounded-full opacity-80'></div>
  <div className='absolute top-6 right-6 w-1 h-1 bg-primary-light rounded-full animate-pulse'></div>
</div>

<div className='absolute bottom-0 left-0 w-20 h-20 z-10'>
  <div className='absolute inset-0 bg-gradient-to-tr from-secondary/30 to-transparent'></div>
  <div className='absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-secondary-light rounded-tr-lg opacity-80 animate-pulse'></div>
  <div className='absolute bottom-2 left-2 w-3 h-3 bg-secondary-light rounded-full animate-ping'></div>

  {/* Tech dots */}
  <div className='absolute bottom-4 left-8 w-1.5 h-1.5 bg-secondary-light rounded-full opacity-80'></div>
  <div className='absolute bottom-8 left-4 w-1.5 h-1.5 bg-secondary-light rounded-full opacity-80'></div>
  <div className='absolute bottom-6 left-6 w-1 h-1 bg-secondary-light rounded-full animate-pulse'></div>
</div>

{/* Scanner effect - horizontal line */}
<div className='absolute left-0 w-full h-[2px] bg-primary-light/70 z-20 animate-[scanner_8s_ease-in-out_infinite] opacity-70'></div>

{/* Glowing hexagon pattern */}
<div className='absolute inset-0 opacity-20 z-10 bg-[radial-gradient(circle,_transparent_30%,_rgba(20,184,166,0.3)_70%)] bg-[length:24px_24px] mix-blend-screen group-hover:opacity-40 transition-opacity duration-700'></div>

{/* Digital circuit pattern */}
<div className='absolute inset-0 opacity-30 z-5'>
  <div className='absolute top-[20%] left-0 w-[15px] h-[1px] bg-primary-light'></div>
  <div className='absolute top-[20%] left-[15px] w-[1px] h-[30px] bg-primary-light'></div>
  <div className='absolute top-[50%] left-[15px] w-[40px] h-[1px] bg-primary-light'></div>

  <div className='absolute top-[30%] right-[20px] w-[1px] h-[40px] bg-secondary-light'></div>
  <div className='absolute top-[70%] right-[20px] w-[20px] h-[1px] bg-secondary-light'></div>

  <div className='absolute bottom-[20%] right-[50px] w-[30px] h-[1px] bg-primary-light'></div>
  <div className='absolute bottom-[20%] right-[50px] w-[1px] h-[25px] bg-primary-light'></div>

  <div className='absolute top-[15%] right-[70px] w-[1px] h-[12px] bg-secondary-light'></div>
  <div className='absolute top-[15%] right-[70px] w-[12px] h-[1px] bg-secondary-light'></div>

  <div className='absolute bottom-[35%] left-[25px] w-[1px] h-[15px] bg-primary-light'></div>
  <div className='absolute bottom-[35%] left-[25px] w-[25px] h-[1px] bg-primary-light'></div>
</div>

{/* Pulsing border */}
<div className='absolute inset-0 border-2 border-primary/80 dark:border-primary-light/80 rounded-lg z-10 shadow-[0_0_15px_rgba(20,184,166,0.8),inset_0_0_15px_rgba(20,184,166,0.3)] dark:shadow-[0_0_20px_rgba(94,234,212,0.8),inset_0_0_15px_rgba(94,234,212,0.3)] opacity-90 animate-[pulse_4s_ease-in-out_infinite]'></div>

{/* Subtle vignette */}
<div className='absolute inset-0 bg-gradient-radial from-transparent to-black/30 dark:to-black/50 z-15'></div>

{/* Glitch effect */}
<div className='absolute inset-0 bg-primary/10 dark:bg-primary-light/10 opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-5'></div>
```

## Larger Version for Desktop

A larger version for desktop was created with slightly different dimensions:

```jsx
{
  /* Tech corner overlays with pulsing effect */
}
;<div className='absolute top-0 right-0 w-24 h-24 z-10'>
  <div className='absolute inset-0 bg-gradient-to-bl from-primary/30 to-transparent'></div>
  <div className='absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-primary-light rounded-bl-lg opacity-80 animate-pulse'></div>
  <div className='absolute top-2 right-2 w-3 h-3 bg-primary-light rounded-full animate-ping'></div>

  {/* Tech dots */}
  <div className='absolute top-5 right-10 w-2 h-2 bg-primary-light rounded-full opacity-80'></div>
  <div className='absolute top-10 right-5 w-2 h-2 bg-primary-light rounded-full opacity-80'></div>
  <div className='absolute top-7 right-7 w-1.5 h-1.5 bg-primary-light rounded-full animate-pulse'></div>
</div>
```

## CSS Animation Keyframes

These animations were defined in `globals.css`:

```css
@keyframes glow {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

@keyframes scanner {
  0%,
  100% {
    top: 5%;
  }
  50% {
    top: 95%;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.7;
    box-shadow: 0 0 15px rgba(20, 184, 166, 0.5), inset 0 0 10px rgba(20, 184, 166, 0.2);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 25px rgba(20, 184, 166, 0.8), inset 0 0 15px rgba(20, 184, 166, 0.4);
  }
}

.bg-gradient-radial {
  background-image: radial-gradient(
    var(--tw-gradient-from),
    var(--tw-gradient-to)
  );
}
```
