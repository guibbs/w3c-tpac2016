if (navigator.serviceWorker) {
  navigator.serviceWorker.register("sw.js").then(function(reg) {
    "use strict";
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.installing) {
      trackInstallation(reg.installing);
      return;
    }

    if (reg.waiting) {
      updateReady(reg.waiting);
      return;
    }

    reg.addEventListener('updatefound', function() {
      trackInstallation(reg.installing);
    });

    navigator.serviceWorker.addEventListener("controllerchange", function() {
      window.location.reload();
    });

    function trackInstallation(sw) {
      sw.addEventListener("statechange", function() {
        switch (sw.state) {
          case "installed":
            updateReady(sw);
            break;
        }
      });
    }

    function updateReady(sw) {
      console.info("Update ready");
      const toast = document.querySelector("#update-toast");
      const refresh = document.querySelector("#refresh");
      const dismiss = document.querySelector("#dismiss");
      toast.classList.add("show");
      dismiss.onclick = function() {
        toast.classList.remove("show");
      };
      refresh.onclick = function() {
        toast.classList.remove("show");
        // Let SW know it can take over
        sw.postMessage({
          action: "skipWaiting"
        });
      };
    }
  });
}
