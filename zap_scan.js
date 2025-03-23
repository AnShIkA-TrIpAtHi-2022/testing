// OWASP ZAP Script: Active Scan for Jenkins
// Ensure ZAP is running in daemon mode with API enabled

// Get the Active Scan extension
var extAscan = org.parosproxy.paros.control.Control.getSingleton()
    .getExtensionLoader()
    .getExtension(org.zaproxy.zap.extension.ascan.ExtensionActiveScan.NAME);

if (extAscan === null) {
    print("Error: Active Scan extension not found!");
    exit();
}

// Function to scan the target URL
function scanTarget(targetUrl) {
    print("Starting Active Scan on: " + targetUrl);

    // Create a target object (Fixes "no applicable overload found" issue)
    var model = org.parosproxy.paros.model.Model.getSingleton();
    var target = new org.zaproxy.zap.model.Target(model.getSession().getSiteTree().getRoot());

    // Start the scan and get scan ID
    var scanId = extAscan.startScan(target);

    while (!extAscan.isScanFinished(scanId)) {
        print("Scanning... Progress: " + extAscan.getScanProgress(scanId) + "%");
        java.lang.Thread.sleep(5000); // Wait 5 seconds before checking progress
    }

    print("Scan Completed. Fetching Results...");

    var alerts = model.getDb().getTableAlert().getAlerts();
    for (var i = 0; i < alerts.size(); i++) {
        var alert = alerts.get(i);
        print("Vulnerability Found: " + alert.getName() + " | Risk: " + alert.getRisk());
        print("URL: " + alert.getUri());
        print("Description: " + alert.getDescription());
        print("------------------------------------------------");
    }

    print("Scan Finished. Check ZAP Reports for detailed results.");
}

// Set target URL (Ensure Jenkins app is running)
var targetUrl = "http://localhost:3000";  // Change if needed
scanTarget(targetUrl);
