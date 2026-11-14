package com.hibuddy.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.graphics.Color;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.net.Uri;

public class MainActivity extends Activity {
    private WebView webView;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(5, 18, 55));
        getWindow().setNavigationBarColor(Color.rgb(5, 18, 55));
        getWindow().getDecorView().setSystemUiVisibility(0);
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(244, 247, 246));
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(false);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                return !("https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme) || "file".equalsIgnoreCase(scheme));
            }
        });
        setContentView(webView);
        String html = "";
        try {
            java.io.InputStream in = getAssets().open("index.html");
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            byte[] buffer = new byte[8192]; int n;
            while ((n = in.read(buffer)) > 0) out.write(buffer, 0, n);
            in.close(); html = out.toString("UTF-8");
        } catch (Exception ignored) {}
        // Give the local page the app's HTTPS origin so Firebase Auth/Firestore can use a secure web origin.
        webView.loadDataWithBaseURL("https://hi-buddy.vercel.app/", html, "text/html", "UTF-8", null);
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (webView != null) { webView.destroy(); webView = null; }
        super.onDestroy();
    }
}
