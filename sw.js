self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data.json(); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title || "Ble te piac o' Pe", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png"
  }));
});
function goFor(t) {
  t = t || "";
  if (/Decreto/.test(t)) return "chat";
  if (/Comitato|Sentenza/.test(t)) return "comitato";
  if (/intelligenza/i.test(t)) return "iq";
  if (/Scambio del giorno/.test(t)) return "giorno";
  if (/scambio|proposta/i.test(t)) return "scambi";
  if (/pietra/i.test(t)) return "gold";
  if (/Offes/.test(t)) return "ins";
  if (/^(💬|📣 .* ti ha citato)/.test(t)) return "chat";
  if (/suggerimento/i.test(t)) return "sug";
  if (/Pronostici|Partita finita/.test(t)) return "play";
  return "home";
}
self.addEventListener("notificationclick", function (e) {
  var go = goFor(e.notification.title);
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (l) {
    for (var i = 0; i < l.length; i++) {
      if ("focus" in l[i]) { try { l[i].postMessage({ go: go }); } catch (x) {} return l[i].focus(); }
    }
    return self.clients.openWindow("./?vai=" + go);
  }));
});
