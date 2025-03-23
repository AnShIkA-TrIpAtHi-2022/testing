// OWASP ZAP Script: Active Scan for Jenkins
// Ensure ZAP is running in daemon mode with API enabled

var zaproxy = org.parosproxy.paros.control.Control.getSingleton().getExtensionLoader().getExtension(
    org.zaproxy.zap.extension.ascan.ExtensionActiveScan.NAME
);

function scanJenkins(targetUrl) {
    print("Starting Active Scan on: " + targetUrl);
    
    var scanId = zaproxy.startScan(targetUrl);
    
    while (!zaproxy.isScanFinished(scanId)) {
        print("Scanning... Progress: " + zaproxy.getScanProgress(scanId) + "%");
        java.lang.Thread.sleep(5000);  // Wait 5 seconds before checking again
    }

    print("Scan Completed. Fetching Results...");

    var alerts = org.parosproxy.paros.model.Model.getSingleton().getDb().getTableAlert().getAlerts();
    for (var i = 0; i < alerts.size(); i++) {
        var alert = alerts.get(i);
        print("Vulnerability Found: " + alert.getName() + " | Risk: " + alert.getRisk());
        print("URL: " + alert.getUri());
        print("Description: " + alert.getDescription());
        print("------------------------------------------------");
    }

    print("Scan Finished. Check ZAP Reports for detailed results.");
}

// Set Jenkins Target URL
var jenkinsUrl = "http://localhost:8080";  // Change to your Jenkins URL
scanJenkins(jenkinsUrl);
