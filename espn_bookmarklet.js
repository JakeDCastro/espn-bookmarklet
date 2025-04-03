'use strict';
;(function(undefined) {

    // Only run on ESPN domains.
    if (!location.hostname.includes('espn.com')) {
        alert('This bookmarklet only works on ESPN!');
        return;
    }

    // Extract the required cookies.
    let cookies = {
        swid: getCookieValue('SWID'),
        espn_s2: getCookieValue('espn_s2')
    };

    if (!cookies.swid || !cookies.espn_s2) {
        alert('It does not appear that you are logged in. Please log into your ESPN account and try again.');
        return;
    }

    // Build the report.
    let report = {
        platform: 'espn',
        cookies: cookies
    };

    // Submit the report by redirecting to your backend endpoint with the data as query parameters.
    submitReport(report);

    // --- Helper Functions ---

    function toQueryString(obj, prefix) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                str.push(typeof v === "object" ?
                    toQueryString(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }

    function submitReport(report) {
        let reportQS = toQueryString(report, 'bmd');
        alert("Thanks! We have what we need.\n\nRedirecting you to complete the league setup.");
        // Redirect to your backend Cloud Function endpoint.
        location.href = "https://us-central1-pressbox-9937a.cloudfunctions.net/platformAccess?" + reportQS;
    }

    function getCookieValue(name) {
        let match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return match ? match.pop() : '';
    }

})(undefined);
