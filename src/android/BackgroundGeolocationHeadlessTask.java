package com.transistorsoft.cordova.bggeo;
import android.content.SharedPreferences;

import org.greenrobot.eventbus.Subscribe;
import org.json.JSONObject;
import java.util.Map;

import com.transistorsoft.locationmanager.adapter.BackgroundGeolocation;
import com.transistorsoft.locationmanager.event.ActivityChangeEvent;
import com.transistorsoft.locationmanager.event.GeofenceEvent;
import com.transistorsoft.locationmanager.event.GeofencesChangeEvent;
import com.transistorsoft.locationmanager.event.ConnectivityChangeEvent;
import com.transistorsoft.locationmanager.event.HeadlessEvent;
import com.transistorsoft.locationmanager.event.HeartbeatEvent;
import com.transistorsoft.locationmanager.event.MotionChangeEvent;
import com.transistorsoft.locationmanager.event.LocationProviderChangeEvent;
import com.transistorsoft.locationmanager.http.HttpResponse;
import com.transistorsoft.locationmanager.location.TSLocation;
import com.transistorsoft.locationmanager.logger.TSLog;

import android.os.StrictMode;

//setGeoPoint API Endpoints
import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import java.util.Date;
import java.text.SimpleDateFormat;

/**
 * BackgroundGeolocationHeadlessTask
 * This component allows you to receive events from the BackgroundGeolocation plugin in the native Android environment while your app has been *terminated*,
 * where the plugin is configured for stopOnTerminate: false.  In this context, only the plugin's service is running.  This component will receive all the same
 * events you'd listen to in the Javascript API.
 *
 * You might use this component to:
 * - fetch / post information to your server (eg: request new API key)
 * - execute BackgroundGeolocation API methods (eg: #getCurrentPosition, #setConfig, #addGeofence, #stop, etc -- you can execute ANY method of the Javascript API)
 */

public class BackgroundGeolocationHeadlessTask  {

    @Subscribe
    public void onHeadlessTask(HeadlessEvent event) {
        SharedPreferences sharedPreferences = event.getContext().getSharedPreferences("BoardActive", 0);

        // Set StrictMode on this file, because it executes in Main(UI) Thread
        // and Android does not allow HTTP Requests in UI Thread
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        String name = event.getName();
        TSLog.logger.debug("\uD83D\uDC80  event: " + event.getName());
        TSLog.logger.debug("- event: " + event.getEvent());
        TSLog.logger.warn(TSLog.warn("[BA:HeadlessMode]: onHeadlessTask"));

        if (name.equals(BackgroundGeolocation.EVENT_TERMINATE)) {
            JSONObject state = event.getTerminateEvent();
            TSLog.logger.warn(TSLog.warn("[BA:HeadlessMode]: EVENT_TERMINATE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_LOCATION)) {
            TSLocation location = event.getLocationEvent();
            // A location event has been received.
            TSLog.logger.debug("[BA:HeadlessMode] " + " HeadlessMode.EVENT_LOCATION");
//
            // Required data init for API
            String AppUrl = sharedPreferences.getString("X-BoardActive-App-Url", null);
            AppUrl = AppUrl + "/locations";
            String AppKey = sharedPreferences.getString("X-BoardActive-App-Key", null);
            String AppID = sharedPreferences.getString("X-BoardActive-App-Id", null);
            String AppVersionNumber = sharedPreferences.getString("X-BoardActive-App-Version", null);
            String DeviceToken = sharedPreferences.getString("X-BoardActive-Device-Token", null);
            String DeviceOS = sharedPreferences.getString("X-BoardActive-Device-OS", null);
            String DeviceOSVersion = sharedPreferences.getString("X-BoardActive-Device-OS-Version", null);
            String DeviceType = sharedPreferences.getString("X-BoardActive-Device-Type", null);
            String AppTest = sharedPreferences.getString("X-BoardActive-Is-Test-App", null);

            Double device_latitude = location.getLocation().getLatitude(); // params.coords.latitude;
            Double device_longitude = location.getLocation().getLongitude(); // params.coords.longitude;

            Map<String, ?> prefsMap = sharedPreferences.getAll();
            TSLog.logger.debug("[BA:HeadlessMode] " + " AllSharedPrefs: " + prefsMap);
            for (Map.Entry<String, ?> entry: prefsMap.entrySet()) {
                TSLog.logger.debug("[BA:HeadlessMode] " + entry.getKey() + ": " + entry.getValue().toString());
            }

            TSLog.logger.debug("[BA:HeadlessMode] " + " device_latitude: " + device_latitude);
            TSLog.logger.debug("[BA:HeadlessMode] " + " device_longitude: " + device_longitude);

            try {
                // Set Create Geopoint API Endpoint and create HTTP Connection with it
                URL obj = new URL(AppUrl.replace("\"", ""));
                HttpURLConnection con = (HttpURLConnection) obj.openConnection();

                // Add request method header
                con.setRequestMethod("POST");

                // Set the other required headers
//                con.setRequestProperty("Content-Type", "application/json");
                con.setRequestProperty("X-BoardActive-App-Key", AppKey.replace("\"", ""));
                con.setRequestProperty("X-BoardActive-App-Id", AppID.replace("\"", ""));
                con.setRequestProperty("X-BoardActive-App-Version", AppVersionNumber.replace("\"", ""));
                con.setRequestProperty("X-BoardActive-Device-Token", DeviceToken.replace("\"", ""));
                con.setRequestProperty("X-BoardActive-Device-OS", DeviceOS.replace("\"", ""));
                con.setRequestProperty("X-BoardActive-Device-Type", DeviceType.replace("\"", ""));
                con.setRequestProperty("X-BoardActive-Device-OS-Version", DeviceOSVersion.replace("\"", ""));
                con.setRequestProperty("X-BoardActive-Is-Test-App", AppTest.replace("\"", ""));
                con.setRequestProperty("X-BoardActive-Latitude", device_latitude.toString());
                con.setRequestProperty("X-BoardActive-Longitude", device_longitude.toString());

                SimpleDateFormat sdf = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss Z");
                String currentDateandTime = sdf.format(new Date());

                // Set POST body
                String body = "{\n" + "  \"latitude\": " + "\"" + device_latitude + "\"" +
                            ",\n" + "  \"longitude\": " + "\"" + device_longitude + "\"" +
                            ",\n" + "  \"deviceTime\": " + "\"" + currentDateandTime + "\"" + "\n" + "}";

                TSLog.logger.debug("[BA:HeadlessMode] " + " body " + body);

                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-App-Key: " + con.getRequestProperty("X-BoardActive-App-Key"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-App-Id: " + con.getRequestProperty("X-BoardActive-App-Id"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-App-Version: " + con.getRequestProperty("X-BoardActive-App-Version"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-Device-Token: " + con.getRequestProperty("X-BoardActive-Device-Token"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-Device-OS: " + con.getRequestProperty("X-BoardActive-Device-OS"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-Device-Type: " + con.getRequestProperty("X-BoardActive-Device-Type"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-Device-OS-Version: " + con.getRequestProperty("X-BoardActive-Device-OS-Version"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-Is-Test-App: " + con.getRequestProperty("X-BoardActive-Is-Test-App"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-Latitude: " + con.getRequestProperty("X-BoardActive-Latitude"));
                TSLog.logger.debug("[BA:HeadlessMode] X-BoardActive-Longitude: " + con.getRequestProperty("X-BoardActive-Longitude"));

                // Send the post request
                con.setDoOutput(true);
                DataOutputStream wr = new DataOutputStream(con.getOutputStream());
                wr.writeBytes(body);
                wr.flush();
                wr.close();

                // Read HTTP Status Code Response and print
                int responseCode = con.getResponseCode();

                TSLog.logger.debug("[BA:HeadlessMode] responseCode " + responseCode);
                TSLog.logger.debug("[BA:HeadlessMode] getResponseMessage " + con.getResponseMessage());

                // Would normally read response body here but server does not send one
                // for 200/201/2xx responses..
                if (responseCode == 201) {
                    TSLog.logger.debug("[BA:HeadlessMode] Server Accepted our POST and updated it's records.");
                } else if (responseCode >= 200 && responseCode < 209) {
                    TSLog.logger.warn("[BA:HeadlessMode] Server Accepted our POST but did not create a new record, Responses 200, 202-208");
                } else {
                    TSLog.logger.warn("[BA:HeadlessMode] Server sent a HTTP Status other than 2xx, check on the endpoint. responseCode: " + responseCode);
                }

                // Print HTTP Status code and POST body
                TSLog.logger.debug("[BA:HeadlessMode] \nSending 'POST' request to URL : " + AppUrl.replace("\"", ""));

                // Disconnect HTTPUrlConnection fully, to positively prevent API
                // response body leaks
                con.disconnect();
                wr.close();

            } catch (Exception e) {
                e.printStackTrace();
                TSLog.logger.debug("[BA:HeadlessMode] POST /locations error] " + e);
            }

        } else if (name.equals(BackgroundGeolocation.EVENT_MOTIONCHANGE)) {
            MotionChangeEvent motionChangeEvent = event.getMotionChangeEvent();
            TSLocation location = motionChangeEvent.getLocation();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_MOTIONCHANGE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_HTTP)) {
            HttpResponse response = event.getHttpEvent();
        } else if (name.equals(BackgroundGeolocation.EVENT_PROVIDERCHANGE)) {
            LocationProviderChangeEvent providerChange = event.getProviderChangeEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_PROVIDERCHANGE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_PROVIDERCHANGE)) {
            LocationProviderChangeEvent providerChange = event.getProviderChangeEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_PROVIDERCHANGE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_ACTIVITYCHANGE)) {
            ActivityChangeEvent activityChange = event.getActivityChangeEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_ACTIVITYCHANGE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_SCHEDULE)) {
            JSONObject state = event.getScheduleEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_SCHEDULE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_BOOT)) {
            JSONObject state = event.getBootEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_BOOT"));
        } else if (name.equals(BackgroundGeolocation.EVENT_GEOFENCE)) {
            GeofenceEvent geofenceEvent = event.getGeofenceEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_GEOFENCE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_GEOFENCESCHANGE)) {
            GeofencesChangeEvent geofencesChangeEvent = event.getGeofencesChangeEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_GEOFENCESCHANGE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_HEARTBEAT)) {
            HeartbeatEvent heartbeatEvent = event.getHeartbeatEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_HEARTBEAT"));
        } else if (name.equals(BackgroundGeolocation.EVENT_NOTIFICATIONACTION)) {
            String buttonId = event.getNotificationEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_NOTIFICATIONACTION"));
        } else if (name.equals(BackgroundGeolocation.EVENT_CONNECTIVITYCHANGE)) {
            ConnectivityChangeEvent connectivityChangeEvent = event.getConnectivityChangeEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_CONNECTIVITYCHANGE"));
        } else if (name.equals(BackgroundGeolocation.EVENT_ENABLEDCHANGE)) {
            boolean enabled = event.getEnabledChangeEvent();
            TSLog.logger.warn(TSLog.warn("[BA: HeadLess]: EVENT_ENABLEDCHANGE"));
        } else {
            TSLog.logger.warn(TSLog.warn("Unknown Headless Event: " + name));
        }
    }
    
}


