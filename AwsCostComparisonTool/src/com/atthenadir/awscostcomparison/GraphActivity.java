package com.atthenadir.awscostcomparison;


import com.google.ads.AdRequest;
import com.google.ads.AdSize;
import com.google.ads.AdView;

import android.os.Bundle;
import android.app.ActionBar;
import android.app.Activity;
import android.view.Menu;
import android.view.Window;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.LinearLayout;

public class GraphActivity extends Activity {
	AdView adView;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_graph);
		ActionBar actionBar = getActionBar();
		actionBar.hide();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {		
		
		adView = new AdView(this, AdSize.BANNER, this.getResources().getString(R.string.ad));
		 LinearLayout layout = (LinearLayout)findViewById(R.id.ad );
		layout.addView(adView);
		final WebView webView = (WebView) findViewById(R.id.webview_content);
		webView.setWebChromeClient(new chromeClient());
		webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
		webView.getSettings().setJavaScriptEnabled(true);  
		webView.getSettings().setBuiltInZoomControls(true);
		
		adView.loadAd(new AdRequest());
		
		webView.loadUrl("file:///android_asset/index.html");
		
		
		return true;
	}
	
	public class chromeClient extends WebChromeClient {
	    @Override
	    public boolean onJsAlert(WebView view,String url,String message,JsResult result) {
	        android.util.Log.v("webview",message);
	        result.confirm();
	        return true;
	    }
	}
	
	@Override
	public void onDestroy() {
	 // AdMobのViewの破棄処理
	 adView.destroy();
	 super.onDestroy();
	}
	
}
