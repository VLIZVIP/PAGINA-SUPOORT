// Notification sound utility
// Developed by oxcyshop

export function playNotificationSound() {
  if (typeof window === "undefined") return

  const soundEnabled = localStorage.getItem("soundEnabled")
  if (soundEnabled === "false") return

  // Create audio context for notification sound
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Pleasant notification sound (two-tone)
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

export function showDesktopNotification(title: string, body: string) {
  if (typeof window === "undefined") return

  const notificationsEnabled = localStorage.getItem("notificationsEnabled")
  if (notificationsEnabled === "false") return

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/logo.png",
      badge: "/logo.png",
    })
  }
}
