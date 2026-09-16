<template>
  <div class="min-h-svh bg-ink">
    <!-- fixed brand canvas: plum gradient + pink/purple glows + grid -->
    <div class="bg-base" aria-hidden="true" />

    <Navbar />

    <!-- bottom padding clears the mobile tab bar -->
    <main class="pb-24 lg:pb-0">
      <slot />
    </main>

    <AppFooter />

    <!-- footer sits above the tab bar on phones -->
    <div class="h-16 lg:hidden" aria-hidden="true" />
    <MobileNavbar />

    <PremiumLockModal />
  </div>
</template>
