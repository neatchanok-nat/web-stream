<template>
  <!-- Immersive layout for watch + live watch: chrome stays, footer drops away -->
  <div class="min-h-svh bg-ink">
    <Navbar />
    <main class="pb-24 lg:pb-10">
      <slot />
    </main>
    <MobileNavbar />

    <PremiumLockModal />
  </div>
</template>
