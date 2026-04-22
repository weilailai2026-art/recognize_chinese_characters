<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center animate-bounce-in">
      <div class="text-6xl mb-3">🎉</div>
      <h2 class="text-2xl font-black text-orange-500 mb-2">欢迎来到认字乐园</h2>
      <p class="text-gray-500 mb-6">每天花几分钟，让孩子用轻松的方式认识更多汉字。</p>

      <div class="space-y-3 text-left mb-6">
        <div class="bg-orange-50 rounded-2xl p-4">
          <div class="font-bold text-orange-500 mb-1">1. 分级学习</div>
          <div class="text-sm text-gray-500">从启蒙级开始，逐步解锁更高难度内容。</div>
        </div>
        <div class="bg-blue-50 rounded-2xl p-4">
          <div class="font-bold text-blue-500 mb-1">2. 游戏式练习</div>
          <div class="text-sm text-gray-500">看字选图、看图选字，边玩边学更容易坚持。</div>
        </div>
        <div class="bg-green-50 rounded-2xl p-4">
          <div class="font-bold text-green-500 mb-1">3. 打卡与成就</div>
          <div class="text-sm text-gray-500">连续学习会解锁成就，让孩子更有动力。</div>
        </div>
      </div>

      <button @click="$emit('finish')" class="w-full btn-primary bg-gradient-to-r from-orange-400 to-pink-500">
        开始认字吧 ✨
      </button>
    </div>
  </div>
</template>
