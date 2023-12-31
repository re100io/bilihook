(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

const e = require("harvester");

(0, e.xInfo)("Hello Frida Hook");

},{"harvester":78}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetMemoryInfo = void 0;

class e {
  startHook() {
    Java.use("android.app.ActivityManager").getMemoryInfo.overload("android.app.ActivityManager$MemoryInfo").implementation = function(e) {
      let o = this.getMemoryInfo(e), t = e.availMem.value;
      return e.availMem.value = t + Math.floor(104857600 * Math.random()), o;
    };
  }
}

exports.HookGetMemoryInfo = e;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetInstalledApplications = void 0;

const t = require("../../../../utils/ReflectTool");

class e {
  _filterPackageList;
  constructor(t) {
    this._filterPackageList = t;
  }
  startHook() {
    let e = this;
    const a = Java.use("android.app.ApplicationPackageManager"), i = Java.use("java.util.ArrayList");
    a.getInstalledApplications.overload("int").implementation = function(a) {
      let o = this.getInstalledApplications(a), s = Java.cast(o, i), l = s.iterator();
      for (;l.hasNext(); ) {
        let a = l.next(), i = (0, t.getFiledObj)(a, "packageName");
        -1 != e._filterPackageList.indexOf(i.toString()) && l.remove();
      }
      return s;
    };
  }
}

exports.HookGetInstalledApplications = e;

},{"../../../../utils/ReflectTool":85}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetInstalledPackages = void 0;

const a = require("../../../..");

class e {
  _changeInstalledPackagesCallback;
  constructor(a) {
    this._changeInstalledPackagesCallback = a;
  }
  startHook() {
    let e = this;
    Java.use("android.app.ApplicationPackageManager").getInstalledPackages.overload("int").implementation = function(t) {
      let l, s = this.getInstalledPackages(t);
      try {
        l = e._changeInstalledPackagesCallback(s);
      } catch (e) {
        return (0, a.xPrint)("||||||||------************changeInstalledPackagesCallback*******报错了，快检查代码"), 
        (0, a.xPrint)("||||||||------************changeInstalledPackagesCallback*******报错了，快检查代码"), 
        (0, a.xPrint)("||||||||------************changeInstalledPackagesCallback*******报错了，快检查代码"), 
        (0, a.xPrint)("||||||||------************changeInstalledPackagesCallback*******报错了，快检查代码", e), 
        s;
      }
      return l;
    };
  }
}

exports.HookGetInstalledPackages = e;

},{"../../../..":78}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetInstallerPackageName = void 0;

class t {
  _installerDict;
  _thirdAppInstaller;
  constructor(t, e) {
    this._installerDict = t, this._thirdAppInstaller = e;
  }
  startHook() {
    const t = this;
    Java.use("android.app.ApplicationPackageManager").getInstallerPackageName.overload("java.lang.String").implementation = function(e) {
      return t._thirdAppInstaller;
    };
  }
}

exports.HookGetInstallerPackageName = t;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetPackageInfo = void 0;

const a = require("../../../..");

class e {
  _changePackageInfoCallback;
  constructor(a) {
    this._changePackageInfoCallback = a;
  }
  startHook() {
    const e = this, n = Java.use("android.app.ApplicationPackageManager");
    n.getPackageInfo.overload("android.content.pm.VersionedPackage", "int").implementation = function(n, t) {
      const c = this.getPackageInfo(n, t);
      let o;
      try {
        o = e._changePackageInfoCallback(c);
      } catch (e) {
        return (0, a.xPrint)("************changePackageInfoCallback*******报错了，快检查代码", e), 
        c;
      }
      return o;
    }, n.getPackageInfo.overload("java.lang.String", "int").implementation = function(n, t) {
      const c = this.getPackageInfo(n, t);
      let o;
      try {
        o = e._changePackageInfoCallback(c);
      } catch (e) {
        return (0, a.xPrint)("************changePackageInfoCallback*******报错了，快检查代码", e), 
        c;
      }
      return o;
    };
  }
}

exports.HookGetPackageInfo = e;

},{"../../../..":78}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookQueryIntentActivities = void 0;

const t = require("../../../..");

class e {
  _hidePackageNameList;
  constructor(t) {
    this._hidePackageNameList = t;
  }
  startHook() {
    let e = this;
    const i = Java.use("android.app.ApplicationPackageManager"), n = Java.use("android.content.pm.ResolveInfo");
    i.queryIntentActivities.overload("android.content.Intent", "int").implementation = function(i, a) {
      const o = this.queryIntentActivities(i, a), s = o.iterator();
      for (;s.hasNext(); ) {
        const i = Java.cast(s.next(), n).activityInfo.value.packageName.value;
        e._hidePackageNameList.indexOf(i) > -1 ? ((0, t.xPrint)("屏蔽通过 queryIntentActivities 获取" + i), 
        s.remove()) : (0, t.xPrint)(i + "放过");
      }
      return o;
    };
  }
}

exports.HookQueryIntentActivities = e;

},{"../../../..":78}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookQuery = void 0;

const t = require("../../../../..");

class e {
  _queryFilterMap;
  constructor(t) {
    this._queryFilterMap = t;
  }
  startHook() {
    const e = this;
    Java.use("android.app.ContextImpl$ApplicationContentResolver").query.overload("android.net.Uri", "[Ljava.lang.String;", "java.lang.String", "[Ljava.lang.String;", "java.lang.String").implementation = function(r, n, o, i, l) {
      try {
        for (let a in e._queryFilterMap) if (r.toString().indexOf(a) > -1) {
          let s = "", p = [];
          for (let t in e._queryFilterMap[a]) {
            const r = e._queryFilterMap[a][t];
            for (let e = 0; e < r.length; e++) 0 != e && (s += " AND "), s += t + " NOT LIKE ?", 
            p.push("%" + r[e] + "%");
          }
          if (o && (s += " AND " + o), i) for (let t = 0; t < i.length; t++) p.push(i[t]);
          return (0, t.xPrint)("ContextImpl$ApplicationContentResolverClass.query过滤[", r, "] selection:", o, "->", s), 
          (0, t.xPrint)("ContextImpl$ApplicationContentResolverClass.query过滤[", r, "] selectionArgs:", JSON.stringify(i), "->", JSON.stringify(p)), 
          this.query(r, n, s, p, l);
        }
      } catch (e) {
        (0, t.xPrint)("hook ApplicationContentResolver.query 异常了请检查:", e);
      }
      return (0, t.xPrint)("ContextImpl$ApplicationContentResolverClass.query放过", r), 
      this.query(r, n, o, i, l);
    };
  }
}

exports.HookQuery = e;

},{"../../../../..":78}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetTopVisibleActivity = void 0;

const e = require("../../../../utils/XPrint");

class t {
  _filterPackageList;
  _fakeComponent;
  constructor(e, t) {
    this._filterPackageList = e, this._fakeComponent = t;
  }
  startHook() {
    let t = this;
    const o = Java.use("android.content.ComponentName");
    Java.use("android.app.IActivityTaskManager$Stub$Proxy").getTopVisibleActivity.overload().implementation = function() {
      let i = this.getTopVisibleActivity();
      if (i) {
        let a = i.getComponent();
        if (a) {
          let n = a.getPackageName();
          if (-1 != t._filterPackageList.indexOf(n)) {
            let e = o.$new(t._fakeComponent.packageName, t._fakeComponent.className);
            i.setComponent(e);
          }
          (0, e.xInfo)("change top Activity", a.getPackageName(), " to ", t._fakeComponent.packageName);
        }
      }
      return i;
    };
  }
}

exports.HookGetTopVisibleActivity = t;

},{"../../../../utils/XPrint":87}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookIsKeyguardSecure = void 0;

class e {
  startHook() {
    Java.use("android.app.KeyguardManager").isKeyguardSecure.overload().implementation = function() {
      return !0;
    };
  }
}

exports.HookIsKeyguardSecure = e;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetDrawable = void 0;

const a = require("../../../..");

class e {
  _fakeWallpaperPath;
  constructor(a) {
    this._fakeWallpaperPath = a;
  }
  startHook() {
    let e = Java.use("android.app.WallpaperManager"), r = Java.use("android.graphics.drawable.BitmapDrawable"), t = Java.use("android.graphics.drawable.Drawable"), l = r.$new("/data/data/com.android.settings/dd/fake_file/fake_wallpaper.png");
    e.getDrawable.overload().implementation = function() {
      return (0, a.xPrint)("[*]call WallpaperManager.getDrawable"), Java.cast(l, t);
    };
  }
}

exports.HookGetDrawable = e;

},{"../../../..":78}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetAppBytes = void 0;

class t {
  _appBytes;
  constructor(t) {
    this._appBytes = t;
  }
  startHook() {
    let t = this;
    Java.use("android.app.usage.StorageStats").getAppBytes.overload().implementation = function() {
      return t._appBytes;
    };
  }
}

exports.HookGetAppBytes = t;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookBlueToothName = void 0;

class o {
  _blueToothName;
  constructor(o) {
    this._blueToothName = o;
  }
  startHook() {
    let o = this;
    Java.use("android.bluetooth.BluetoothAdapter").getName.overload().implementation = function() {
      return o._blueToothName;
    };
  }
}

exports.HookBlueToothName = o;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookPrepareToEnterProcess = void 0;

class t {
  _getData;
  constructor(t) {
    this._getData = t;
  }
  startHook() {
    let t = this;
    Java.use("android.content.Intent").prepareToEnterProcess.overload().implementation = function() {
      if ("android.intent.action.BATTERY_CHANGED" == this.mAction.value) {
        let e = t._getData();
        this.mExtras.value.putInt("status", e.status), this.mExtras.value.putInt("level", e.level);
      }
      this.prepareToEnterProcess();
    };
  }
}

exports.HookPrepareToEnterProcess = t;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetPackageNames = void 0;

class e {
  _fileterPackageList;
  constructor(e) {
    this._fileterPackageList = e;
  }
  startHook() {
    let e = this;
    const t = Java.use("android.content.pm.ChangedPackages"), a = Java.use("java.util.ArrayList");
    t.getPackageNames.overload().implementation = function() {
      let t = this.getPackageNames(), s = Java.cast(t, a), o = s.iterator();
      for (;o.hasNext(); ) {
        let t = o.next();
        -1 != e._fileterPackageList.indexOf(t.toString()) && o.remove();
      }
      return s;
    };
  }
}

exports.HookGetPackageNames = e;

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookDispatchSensorEvent = void 0;

const a = require("../../../../../index");

class e {
  _sensorInfo;
  constructor(a) {
    this._sensorInfo = a;
  }
  getFakeValue(a) {
    let e = [ 0, 0, 0 ], t = this._sensorInfo.type[parseInt(a)], o = Math.floor(251 * Math.random()), r = t[Math.floor(6 * Math.random())][o];
    return e[0] = r.x, e[1] = r.y, e[2] = r.z, e;
  }
  randomFloat() {
    return Math.random() + Math.floor(85 * Math.random() + 30);
  }
  startHook() {
    let e = this, t = Java.use("android.hardware.Sensor"), o = this.randomFloat(), r = Java.use("java.lang.Integer");
    const n = (0, a.getMethodAddr)("android.hardware.SystemSensorManager$SensorEventQueue", "dispatchSensorEvent", "(I[FIJ)V");
    Java.use("android.hardware.SystemSensorManager$SensorEventQueue").dispatchSensorEvent.overload("int", "[F", "int", "long").implementation = function(s, d, h, l) {
      let i, M = this.mManager.value.mHandleToSensor.value.get(r.$new(s));
      if (M) {
        let a = Java.cast(M, t).getType();
        1 != a && 2 != a && 4 != a && 9 != a && 10 != a || (i = e.getFakeValue(a), d[0] = i[0] + .1 * Math.random() * [ -1, 1 ][Math.floor(2 * Math.random())], 
        d[1] = i[1] + .1 * Math.random() * [ -1, 1 ][Math.floor(2 * Math.random())], d[2] = i[2] + .1 * Math.random() * [ -1, 1 ][Math.floor(2 * Math.random())]), 
        5 == a && (d[0] = o + .1 * Math.random() * [ -1, 1 ][Math.floor(2 * Math.random())]);
      }
      this.dispatchSensorEvent(s, d, h, l), (0, a.clearArtMethodHotnessCount)(n);
    };
  }
}

exports.HookDispatchSensorEvent = e;

},{"../../../../../index":78}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetLatitude = void 0;

const RandomLocationFloat_1 = require("./RandomLocationFloat");

class HookGetLatitude {
  _latitude;
  constructor(t) {
    this._latitude = t;
  }
  startHook() {
    let that = this, Location = Java.use("android.location.Location");
    Location.getLatitude.overload().implementation = function() {
      let last_ret = (0, RandomLocationFloat_1.RandomLocationFloat)(that._latitude);
      return eval(last_ret);
    };
  }
}

exports.HookGetLatitude = HookGetLatitude;

},{"./RandomLocationFloat":21}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetLongitude = void 0;

const RandomLocationFloat_1 = require("./RandomLocationFloat");

class HookGetLongitude {
  _longitude;
  constructor(o) {
    this._longitude = o;
  }
  startHook() {
    let that = this, Location = Java.use("android.location.Location");
    Location.getLongitude.overload().implementation = function() {
      let last_ret = (0, RandomLocationFloat_1.RandomLocationFloat)(that._longitude);
      return eval(last_ret);
    };
  }
}

exports.HookGetLongitude = HookGetLongitude;

},{"./RandomLocationFloat":21}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSetLatitude = void 0;

const __1 = require("../../../..");

class HookSetLatitude {
  _latitude;
  constructor(t) {
    this._latitude = t;
  }
  startHook() {
    let that = this, Location = Java.use("android.location.Location");
    Location.setLatitude.overload("double").implementation = function(a1) {
      let last_ret = (0, __1.RandomLocationFloat)(that._latitude);
      this.setLatitude(eval(last_ret));
    };
  }
}

exports.HookSetLatitude = HookSetLatitude;

},{"../../../..":78}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSetLongitude = void 0;

const o = require("../../../..");

class t {
  _longitude;
  constructor(o) {
    this._longitude = o;
  }
  startHook() {
    let t = this;
    Java.use("android.location.Location").setLongitude.overload("double").implementation = function(e) {
      (0, o.RandomLocationFloat)(t._longitude);
      this.setLongitude(e);
    };
  }
}

exports.HookSetLongitude = t;

},{"../../../..":78}],21:[function(require,module,exports){
"use strict";

function t(t) {
  const o = String(t).split(".");
  if (2 == o.length) {
    let e = o[1].substring(0, 4), n = "";
    if (o[1].length >= 4) {
      for (let t = 0; t < o[1].length - 4; t++) n += String(Math.floor(10 * Math.random()));
      t = o[0] + "." + e + n;
    }
  }
  return t;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.RandomLocationFloat = void 0, exports.RandomLocationFloat = t;

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetMode = void 0;

class e {
  modeIndex;
  constructor(e) {
    this.modeIndex = e;
  }
  startHook() {
    const e = Java.use("android.media.AudioManager");
    let o = this;
    e.getMode.implementation = function() {
      return o.modeIndex ? o.modeIndex : this.getMode();
    };
  }
}

exports.HookGetMode = e;

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetStreamVolume = void 0;

const o = require("../../../..");

class t {
  _soundInfoDict;
  constructor(o) {
    this._soundInfoDict = o;
  }
  startHook() {
    const t = Java.use("android.media.AudioManager");
    let e = this;
    t.getStreamVolume.implementation = function(t) {
      if (e._soundInfoDict && e._soundInfoDict.hasOwnProperty(t)) {
        let n = e._soundInfoDict[t];
        return (0, o.xPrint)("hook sound: ", t, "-> ", n), n;
      }
      return this.getStreamVolume(t);
    };
  }
}

exports.HookGetStreamVolume = t;

},{"../../../..":78}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetDefaultProxy = void 0;

const t = require("../../../..");

class e {
  _proxyInfo;
  constructor(t) {
    this._proxyInfo = t;
  }
  startHook() {
    let e = this;
    Java.use("android.net.ConnectivityManager").getDefaultProxy.overload().implementation = function() {
      return (0, t.xPrint)("[*] call ConnectivityManager.getDefaultProxy"), e._proxyInfo;
    };
  }
}

exports.HookGetDefaultProxy = e;

},{"../../../..":78}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetHttpProxy = void 0;

const t = require("../../../..");

class o {
  _proxyInfo;
  constructor(t) {
    this._proxyInfo = t;
  }
  startHook() {
    let o = this;
    Java.use("android.net.LinkProperties").getHttpProxy.overload().implementation = function() {
      return (0, t.xPrint)("[*] call LinkProperties.getHttpProxy"), o._proxyInfo;
    };
  }
}

exports.HookGetHttpProxy = o;

},{"../../../..":78}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookHasTransport = void 0;

const t = require("../../../..");

class o {
  _infoDict;
  constructor(t) {
    this._infoDict = t;
  }
  startHook() {
    let o = this;
    Java.use("android.net.NetworkCapabilities").hasTransport.overload("int").implementation = function(r) {
      return (0, t.xPrint)("[*] call NetworkCapabilities.hasTransport"), o._infoDict && o._infoDict.hasOwnProperty(r) ? o._infoDict[r] : this.hasTransport(r);
    };
  }
}

exports.HookHasTransport = o;

},{"../../../..":78}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetDefaultHost = void 0;

const t = require("../../../..");

class e {
  startHook() {
    Java.use("android.net.Proxy").getDefaultHost.overload().implementation = function() {
      (0, t.xPrint)("[*] call Proxy.getDefaultHost");
      let e = this.getDefaultHost();
      return (0, t.xPrint)("[*]ret=", e), e;
    };
  }
}

exports.HookGetDefaultHost = e;

},{"../../../..":78}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetDefaultPort = void 0;

const t = require("../../../..");

class e {
  startHook() {
    Java.use("android.net.Proxy").getDefaultPort.overload().implementation = function() {
      (0, t.xPrint)("[*] call Proxy.getDefaultPort");
      let e = this.getDefaultPort();
      return (0, t.xPrint)("[*]ret=", e), e;
    };
  }
}

exports.HookGetDefaultPort = e;

},{"../../../..":78}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetConfiguredNetworks = void 0;

class e {
  startHook() {
    Java.use("android.net.wifi.WifiManager").getConfiguredNetworks.overload().implementation = function() {
      let e = this.getConfiguredNetworks();
      return e.clear(), e;
    };
  }
}

exports.HookGetConfiguredNetworks = e;

},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetConnectionInfo = void 0;

const i = require("../../../../..");

class e {
  _wifiInfo;
  constructor(i) {
    this._wifiInfo = i;
  }
  startHook() {
    let e = this;
    const n = Java.use("android.net.wifi.WifiManager"), o = Java.use("java.net.Inet4Address"), s = Java.use("android.net.wifi.WifiSsid");
    n.getConnectionInfo.overload().implementation = function() {
      let n = this.getConnectionInfo();
      if (n) {
        const t = n.getSSID();
        t.indexOf("unknown ssid") < 0 && ((0, i.xPrint)("hook ssid: [", t, "] -> [", e._wifiInfo.ssid, "]"), 
        n.setSSID(s.createFromAsciiEncoded(e._wifiInfo.ssid)));
        const f = n.getBSSID();
        f.indexOf("02:00:00:00:00:00") < 0 && ((0, i.xPrint)("hook bssid: [", f, "] -> [", e._wifiInfo.bssid, "]"), 
        n.setBSSID(e._wifiInfo.bssid)), n.setRssi(e._wifiInfo.rssi), n.setLinkSpeed(e._wifiInfo.linkSpeed), 
        n.setInetAddress(o.getByName(e._wifiInfo.ipStr));
      }
      return n;
    };
  }
}

exports.HookGetConnectionInfo = e;

},{"../../../../..":78}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetScanResults = void 0;

class e {
  _onScanResultsChangedCallback;
  constructor(e) {
    this._onScanResultsChangedCallback = e;
  }
  startHook() {
    let e = this;
    const t = Java.use("android.net.wifi.WifiManager");
    this._onScanResultsChangedCallback && (t.getScanResults.overload().implementation = function() {
      let t = this.getScanResults();
      if (t && t.size() > 0) {
        let t = e._onScanResultsChangedCallback.getScanResultList();
        if (t && t.size() > 0) return t;
      }
      return t;
    });
  }
}

exports.HookGetScanResults = e;

},{}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookBuildField = void 0;

class i {
  _fieldDict;
  _Build=Java.use("android.os.Build");
  constructor(i) {
    this._fieldDict = i;
  }
  startHook() {
    for (let i in this._fieldDict) this._fieldDict.hasOwnProperty(i) && this.setFieldValue(i, this._fieldDict[i]);
  }
  setFieldValue(i, e) {
    this._Build[i].value = e;
  }
}

exports.HookBuildField = i;

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookBuildVersionField = void 0;

class i {
  _fieldDict;
  _BuildVERSION=Java.use("android.os.Build$VERSION");
  constructor(i) {
    this._fieldDict = i;
  }
  setFieldString(i, e) {
    this._BuildVERSION[i].value = e;
  }
  startHook() {
    for (let i in this._fieldDict) this._fieldDict.hasOwnProperty(i) && this.setFieldString(i, this._fieldDict[i]);
  }
}

exports.HookBuildVersionField = i;

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetAvailableBlocks = void 0;

class t {
  _availableBlocks;
  _path;
  constructor(t) {
    this._availableBlocks = t;
  }
  startHook() {
    let t = this, a = Java.use("android.os.StatFs");
    a.getAvailableBlocks.overload().implementation = function() {
      return -1 != t._path.indexOf("/data") || -1 != t._path.indexOf("/storage/emulated/0") ? t._availableBlocks : this.getAvailableBlocks();
    }, a.doStat.overload("java.lang.String").implementation = function(a) {
      return t._path = a, this.doStat(a);
    };
  }
}

exports.HookGetAvailableBlocks = t;

},{}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetBlockSize = void 0;

class e {
  _lockSize;
  constructor(e) {
    this._lockSize = e;
  }
  startHook() {
    let e = this;
    Java.use("android.os.StatFs").getBlockSize.overload().implementation = function() {
      return e._lockSize;
    };
  }
}

exports.HookGetBlockSize = e;

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookNativeGet = void 0;

const t = require("../../../..");

class e {
  _buildInfo;
  _blackList;
  _log;
  constructor(t, e, i = !1) {
    this._buildInfo = t, this._blackList = e, this._log = i;
  }
  startHook() {
    let e = this;
    Java.use("android.os.SystemProperties").native_get.overload("java.lang.String").implementation = function(i) {
      let o;
      return -1 != e._blackList.indexOf(i) ? (e._log && (0, t.xPrint)("[native_get] 过滤->", i), 
      o = this.native_get("ro.fuck.you")) : e._buildInfo.hasOwnProperty(i) ? (o = e._buildInfo[i], 
      e._log && (0, t.xPrint)("[native_get] 替换->", i, "->", o)) : (o = this.native_get(i), 
      e._log && (0, t.xPrint)("[native_get] 放过->", i, "->", o)), o;
    };
  }
}

exports.HookNativeGet = e;

},{"../../../..":78}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSystemPropGet = void 0;

const t = require("../../../..");

class e {
  _buildInfo;
  _blackList;
  _log;
  constructor(t, e, o = !1) {
    this._buildInfo = t, this._blackList = e, this._log = o;
  }
  startHook() {
    let e = this, o = Java.use("android.os.SystemProperties");
    o.get.overload("java.lang.String", "java.lang.String").implementation = function(o, r) {
      let i;
      return -1 != e._blackList.indexOf(o) ? (e._log && (0, t.xPrint)("[SystemProperties.get1] 过滤->", o), 
      i = r) : e._buildInfo.hasOwnProperty(o) ? (i = e._buildInfo[o], e._log && (0, t.xPrint)("[SystemProperties.get1] 替换->", o, "->", i)) : (i = this.get(o, r), 
      e._log && (0, t.xPrint)("[SystemProperties.get1] 放过->", o, "->", i)), i;
    }, o.get.overload("java.lang.String").implementation = function(o) {
      let r;
      return -1 != e._blackList.indexOf(o) ? (e._log && (0, t.xPrint)("[SystemProperties.get2] 过滤->", o), 
      r = this.get("ro.fuck.you")) : e._buildInfo.hasOwnProperty(o) ? (r = e._buildInfo[o], 
      e._log && (0, t.xPrint)("[SystemProperties.get2] 替换->", o, "->", r)) : (r = this.get(o), 
      e._log && (0, t.xPrint)("[SystemProperties.get2] 放过->", o, "->", r)), r;
    };
  }
}

exports.HookSystemPropGet = e;

},{"../../../..":78}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGlobalGetInt = void 0;

class t {
  _infoDict;
  constructor(t) {
    this._infoDict = t;
  }
  startHook() {
    let t = this, n = Java.use("android.provider.Settings$Global");
    n.getInt.overload("android.content.ContentResolver", "java.lang.String", "int").implementation = function(n, o, e) {
      return t._infoDict.hasOwnProperty(o) ? t._infoDict[o] : this.getInt(n, o, e);
    }, n.getInt.overload("android.content.ContentResolver", "java.lang.String").implementation = function(n, o) {
      return t._infoDict.hasOwnProperty(o) ? t._infoDict[o] : this.getInt(n, o);
    };
  }
}

exports.HookGlobalGetInt = t;

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGlobalGetString = void 0;

class t {
  _infoDict;
  constructor(t) {
    this._infoDict = t;
  }
  startHook() {
    let t = this;
    Java.use("android.provider.Settings$Global").getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(o, e) {
      return t._infoDict.hasOwnProperty(e) ? t._infoDict[e] : this.getString(o, e);
    };
  }
}

exports.HookGlobalGetString = t;

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSecureGetInt = void 0;

class t {
  _infoDict;
  constructor(t) {
    this._infoDict = t;
  }
  startHook() {
    let t = this, e = Java.use("android.provider.Settings$Secure");
    e.getInt.overload("android.content.ContentResolver", "java.lang.String", "int").implementation = function(e, n, o) {
      return t._infoDict.hasOwnProperty(n) ? t._infoDict[n] : this.getInt(e, n, o);
    }, e.getInt.overload("android.content.ContentResolver", "java.lang.String").implementation = function(e, n) {
      return t._infoDict.hasOwnProperty(n) ? t._infoDict[n] : this.getInt(e, n);
    };
  }
}

exports.HookSecureGetInt = t;

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSecureGetString = void 0;

class t {
  _infoDict;
  constructor(t) {
    this._infoDict = t;
  }
  startHook() {
    let t = this;
    Java.use("android.provider.Settings$Secure").getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(e, o) {
      return t._infoDict.hasOwnProperty(o) ? t._infoDict[o] : this.getString(e, o);
    };
  }
}

exports.HookSecureGetString = t;

},{}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSystemGetInt = void 0;

class t {
  _infoDict;
  constructor(t) {
    this._infoDict = t;
  }
  startHook() {
    let t = this, n = Java.use("android.provider.Settings$System");
    n.getInt.overload("android.content.ContentResolver", "java.lang.String").implementation = function(n, e) {
      return t._infoDict.hasOwnProperty(e) ? t._infoDict[e] : this.getInt(n, e);
    }, n.getInt.overload("android.content.ContentResolver", "java.lang.String", "int").implementation = function(n, e, o) {
      return t._infoDict.hasOwnProperty(e) ? t._infoDict[e] : this.getInt(n, e, o);
    };
  }
}

exports.HookSystemGetInt = t;

},{}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSystemGetString = void 0;

class t {
  _infoDict;
  constructor(t) {
    this._infoDict = t;
  }
  startHook() {
    let t = this;
    Java.use("android.provider.Settings$System").getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(e, o) {
      return t._infoDict.hasOwnProperty(o) ? t._infoDict[o] : this.getString(e, o);
    };
  }
}

exports.HookSystemGetString = t;

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetAllCellInfo = void 0;

const l = require("./PrintLog");

class e {
  _allCellInfo;
  constructor(l) {
    this._allCellInfo = l;
  }
  startHook() {
    let e = this, o = Java.use("android.telephony.TelephonyManager");
    const t = Java.use("java.util.ArrayList");
    o.getAllCellInfo.overload().implementation = function() {
      return e._allCellInfo && e._allCellInfo.size() > 0 ? ((0, l.printLog)(this, "getAllCellInfo", null), 
      t.$new(e._allCellInfo)) : this.getAllCellInfo();
    };
  }
}

exports.HookGetAllCellInfo = e;

},{"./PrintLog":63}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetCellLocation = void 0;

const o = require("./PrintLog");

class e {
  _cellLocation;
  constructor(o) {
    this._cellLocation = o;
  }
  startHook() {
    let e = this;
    Java.use("android.telephony.TelephonyManager").getCellLocation.overload().implementation = function() {
      return (0, o.printLog)(this, "getCellLocation", null), e._cellLocation;
    };
  }
}

exports.HookGetCellLocation = e;

},{"./PrintLog":63}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetCurrentPhoneTypeForSlot = void 0;

const e = require("./PrintLog");

class o {
  _phoneTypeForSlot;
  constructor(e) {
    this._phoneTypeForSlot = e;
  }
  startHook() {
    let o = this;
    Java.use("android.telephony.TelephonyManager").getCurrentPhoneTypeForSlot.overload("int").implementation = function(t) {
      let r = o._phoneTypeForSlot;
      return (0, e.printLogArg1)(this, "getCurrentPhoneTypeForSlot", t, r), r;
    };
  }
}

exports.HookGetCurrentPhoneTypeForSlot = o;

},{"./PrintLog":63}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetDeviceId = void 0;

const e = require("./PrintLog");

class i {
  _imei1;
  _imei2;
  constructor(e, i) {
    this._imei1 = e, this._imei2 = i;
  }
  startHook() {
    let i = this, t = Java.use("android.telephony.TelephonyManager");
    t.getDeviceId.overload().implementation = function() {
      let t = i._imei1;
      return (0, e.printLog)(this, "getDeviceId", t), t;
    }, t.getDeviceId.overload("int").implementation = function(t) {
      let o;
      return 0 == t ? o = i._imei1 : 1 == t && (o = i._imei2), (0, e.printLogArg1)(this, "getDeviceId", t, o), 
      o;
    };
  }
}

exports.HookGetDeviceId = i;

},{"./PrintLog":63}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetImei = void 0;

const e = require("./PrintLog");

class i {
  _imei1;
  _imei2;
  constructor(e, i) {
    this._imei1 = e, this._imei2 = i;
  }
  startHook() {
    let i = this;
    Java.use("android.telephony.TelephonyManager").getImei.overload("int").implementation = function(t) {
      let o;
      return 0 == t || 2147483647 == t ? o = i._imei1 : 1 == t && (o = i._imei2), (0, 
      e.printLogArg1)(this, "getImei", t, o), o;
    };
  }
}

exports.HookGetImei = i;

},{"./PrintLog":63}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetLine1Number = void 0;

const e = require("./PrintLog");

class t {
  _phonenum;
  constructor(e) {
    this._phonenum = e;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getLine1Number.overload().implementation = function() {
      let o = t._phonenum;
      return (0, e.printLog)(this, "getLine1Number", o), o;
    };
  }
}

exports.HookGetLine1Number = t;

},{"./PrintLog":63}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetNetworkOperator = void 0;

const e = require("./PrintLog");

class t {
  _networkOperator;
  constructor(e) {
    this._networkOperator = e;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getNetworkOperator.overload().implementation = function() {
      let r = t._networkOperator;
      return (0, e.printLog)(this, "getNetworkOperator", r), r;
    };
  }
}

exports.HookGetNetworkOperator = t;

},{"./PrintLog":63}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetNetworkSpecifier = void 0;

const e = require("./PrintLog");

class t {
  _networkSpecifier;
  constructor(e) {
    this._networkSpecifier = e;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getNetworkSpecifier.overload().implementation = function() {
      let r = t._networkSpecifier;
      return (0, e.printLog)(this, "getNetworkSpecifier", r), r;
    };
  }
}

exports.HookGetNetworkSpecifier = t;

},{"./PrintLog":63}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetNetworkType = void 0;

const e = require("./PrintLog");

class t {
  _networkType;
  constructor(e) {
    this._networkType = e;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getNetworkType.overload().implementation = function() {
      let o = t._networkType;
      return (0, e.printLog)(this, "getNetworkType", o), o;
    };
  }
}

exports.HookGetNetworkType = t;

},{"./PrintLog":63}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetPhoneType = void 0;

const e = require("./PrintLog");

class o {
  _phoneType;
  constructor(e) {
    this._phoneType = e;
  }
  startHook() {
    let o = this;
    Java.use("android.telephony.TelephonyManager").getPhoneType.overload().implementation = function() {
      let t = o._phoneType;
      return (0, e.printLog)(this, "getPhoneType", t), t;
    };
  }
}

exports.HookGetPhoneType = o;

},{"./PrintLog":63}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetSignalStrength = void 0;

const t = require("./PrintLog");

class e {
  _signalStrength;
  constructor(t) {
    this._signalStrength = t;
  }
  startHook() {
    let e = this;
    const n = Java.use("android.telephony.TelephonyManager"), o = Java.use("android.telephony.SignalStrength");
    n.getSignalStrength.overload().implementation = function() {
      return (0, t.printLog)(this, "getSignalStrength", null), o.$new(e._signalStrength);
    };
  }
}

exports.HookGetSignalStrength = e;

},{"./PrintLog":63}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetSimCarrierId = void 0;

const r = require("./PrintLog");

class e {
  _simCarrierId;
  constructor(r) {
    this._simCarrierId = r;
  }
  startHook() {
    let e = this;
    Java.use("android.telephony.TelephonyManager").getSimCarrierId.overload().implementation = function() {
      let t = e._simCarrierId;
      return (0, r.printLog)(this, "getSimCarrierId", t), t;
    };
  }
}

exports.HookGetSimCarrierId = e;

},{"./PrintLog":63}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetSimCountryIso = void 0;

const o = require("./PrintLog");

class t {
  _simCountryIso;
  constructor(o) {
    this._simCountryIso = o;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getSimCountryIso.overload().implementation = function() {
      let e = t._simCountryIso;
      return (0, o.printLog)(this, "getSimCountryIso", e), e;
    };
  }
}

exports.HookGetSimCountryIso = t;

},{"./PrintLog":63}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetSimOperator = void 0;

const e = require("./PrintLog");

class t {
  _simOperator;
  constructor(e) {
    this._simOperator = e;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getSimOperator.overload().implementation = function() {
      let r = t._simOperator;
      return (0, e.printLog)(this, "getSimOperator", r), r;
    };
  }
}

exports.HookGetSimOperator = t;

},{"./PrintLog":63}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetSimOperatorName = void 0;

const e = require("./PrintLog");

class t {
  _simOperatorName;
  constructor(e) {
    this._simOperatorName = e;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getSimOperatorName.overload().implementation = function() {
      let r = t._simOperatorName;
      return (0, e.printLog)(this, "getSimOperatorName", r), r;
    };
  }
}

exports.HookGetSimOperatorName = t;

},{"./PrintLog":63}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetSimSerialNumber = void 0;

const e = require("./PrintLog");

class t {
  _iccid;
  constructor(e) {
    this._iccid = e;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getSimSerialNumber.overload().implementation = function() {
      let i = t._iccid;
      return (0, e.printLog)(this, "getSimSerialNumber", i), i;
    };
  }
}

exports.HookGetSimSerialNumber = t;

},{"./PrintLog":63}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetSimState = void 0;

const t = require("./PrintLog");

class e {
  _simState;
  constructor(t) {
    this._simState = t;
  }
  startHook() {
    let e = this;
    Java.use("android.telephony.TelephonyManager").getSimState.overload().implementation = function() {
      let o = e._simState;
      return (0, t.printLog)(this, "getSimState", o), o;
    };
  }
}

exports.HookGetSimState = e;

},{"./PrintLog":63}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetSubscriberId = void 0;

const e = require("./PrintLog");

class t {
  _imsi;
  constructor(e) {
    this._imsi = e;
  }
  startHook() {
    let t = this;
    Java.use("android.telephony.TelephonyManager").getSubscriberId.overload().implementation = function() {
      let r = t._imsi;
      return (0, e.printLog)(this, "getSubscriberId", r), r;
    };
  }
}

exports.HookGetSubscriberId = t;

},{"./PrintLog":63}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookHasIccCard = void 0;

const e = require("./PrintLog");

class r {
  _hasIccCard;
  constructor(e) {
    this._hasIccCard = e;
  }
  startHook() {
    let r = this;
    Java.use("android.telephony.TelephonyManager").hasIccCard.overload().implementation = function() {
      let a = r._hasIccCard;
      return (0, e.printLog)(this, "hasIccCard", a), a;
    };
  }
}

exports.HookHasIccCard = r;

},{"./PrintLog":63}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.printLogArg1 = exports.printLog = exports.TEL_LOG = void 0;

const __1 = require("../../../..");

function printLog(this_pointer, func_name, ret) {
  if (exports.TEL_LOG) {
    let oret = eval("this_pointer." + func_name + "()");
    (0, __1.xPrint)("[*] TelephonyManager." + func_name + "() ret->", oret, "hook ->", ret);
  }
}

function printLogArg1(this_pointer, func_name, a1, ret) {
  if (exports.TEL_LOG) {
    let oret = eval("this_pointer." + func_name + "(a1)");
    (0, __1.xPrint)("[*] TelephonyManager." + func_name + "(" + a1 + ") ret->", oret, "hook ->", ret);
  }
}

exports.TEL_LOG = !1, exports.printLog = printLog, exports.printLogArg1 = printLogArg1;

},{"../../../..":78}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetOAID = void 0;

const o = require("../../../../../..");

class t {
  _oaid;
  constructor(o) {
    this._oaid = o;
  }
  startHook() {
    try {
      let o = this;
      Java.use("com.android.id.impl.IdProviderImpl").getOAID.overload("android.content.Context").implementation = function(t) {
        return o._oaid;
      };
    } catch (t) {
      (0, o.xPrint)("HookGetOAID fail", t);
    }
  }
}

exports.HookGetOAID = t;

},{"../../../../../..":78}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookLastModified = void 0;

class t {
  _lastModifyTimeMap;
  constructor(t) {
    this._lastModifyTimeMap = t;
  }
  startHook() {
    const t = this, e = Java.use("java.io.File"), i = Java.use("java.lang.System");
    e.lastModified.overload().implementation = function() {
      const e = i.getSecurityManager();
      if (null != e && e.checkRead(this.path.value), this.isInvalid()) return 0;
      const a = this.getAbsolutePath();
      return t._lastModifyTimeMap.hasOwnProperty(a) ? t._lastModifyTimeMap[a] : this.fs.value.getLastModifiedTime(this);
    };
  }
}

exports.HookLastModified = t;

},{}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookRuntimeExec = void 0;

const e = require("../../../..");

class t {
  _cmdDict;
  constructor(e) {
    this._cmdDict = e;
  }
  startHook() {
    let t = this;
    Java.use("java.lang.Runtime").exec.overload("[Ljava.lang.String;", "[Ljava.lang.String;", "java.io.File").implementation = function(i, r, n) {
      let c = "";
      for (let e = 0; e < i.length; e++) c += i[e] + " ";
      c = c.trim().replace(/\s+/g, " ");
      let o, l = c.split(" "), s = "";
      for (let e = 1; e < l.length; e++) e != l.length - 1 ? s += l[e] + " " : s += l[e];
      let a = l[0].split("/"), u = a[a.length - 1];
      if (t._cmdDict.hasOwnProperty(u)) {
        let i = t._cmdDict[u];
        if (i.hasOwnProperty("*")) return o = i["*"] + " " + s, (0, e.xPrint)("[Runtime.exec 拦截]", c, "->", o), 
        this.exec(o, r, n);
        if (i.hasOwnProperty(s)) return o = i[s], (0, e.xPrint)("[Runtime.exec 拦截]", c, "->", o), 
        this.exec(o, r, n);
      }
      return (0, e.xPrint)("[Runtime.exec]", c, "放过"), this.exec(i, r, n);
    };
  }
}

exports.HookRuntimeExec = t;

},{"../../../..":78}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetProperty = void 0;

class t {
  _infoDict;
  constructor(t) {
    this._infoDict = t;
  }
  startHook() {
    let t = this;
    Java.use("java.lang.System").getProperty.overload("java.lang.String").implementation = function(e) {
      return t._infoDict.hasOwnProperty(e) ? t._infoDict[e] : this.getProperty(e);
    };
  }
}

exports.HookGetProperty = t;

},{}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetHardwareAddress = void 0;

const e = require("../../../../utils/ReflectTool");

class t {
  _macAddr;
  constructor(e) {
    this._macAddr = e;
  }
  startHook() {
    let t = this;
    Java.use("java.net.NetworkInterface").getHardwareAddress.overload().implementation = function() {
      return "wlan0" == this.getName() ? (0, e.str2BytesObj)(t._macAddr) : this.getHardwareAddress();
    };
  }
}

exports.HookGetHardwareAddress = t;

},{"../../../../utils/ReflectTool":85}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookGetNetworkInterfaces = void 0;

const a = require("../../../../utils/ReflectTool");

class t {
  _wlan0_ipv4_str;
  _wlan0_ipv6;
  _mac_addr;
  _wlan0_ipv4_broadcast_str;
  _wlan0_ipv4_netmask_str;
  _fuck_ipv4_str;
  _fuck_ipv6;
  _fuck_mac;
  _fuck_ipv4_broadcast_str;
  _fuck_ipv4_netmask_str;
  constructor(a, t, e, r, s, _, n, i, v, c) {
    this._wlan0_ipv4_str = a, this._wlan0_ipv6 = t, this._mac_addr = e, this._wlan0_ipv4_broadcast_str = r, 
    this._wlan0_ipv4_netmask_str = s, this._fuck_ipv4_str = _, this._fuck_ipv6 = n, 
    this._fuck_mac = i, this._fuck_ipv4_broadcast_str = v, this._fuck_ipv4_netmask_str = c;
  }
  macStrToMacList(a) {
    let t = a.length, e = [];
    t % 2 == 1 && (a = "0" + a);
    let r = 0;
    for (let s = 0; s < t; s += 2) {
      let t = "0x" + a.substring(s, s + 2);
      e[r] = parseInt(t), r++;
    }
    return e;
  }
  startHook() {
    let t = this;
    const e = Java.use("java.net.NetworkInterface"), r = Java.use("java.util.ArrayList"), s = Java.use("java.util.List"), _ = Java.use("java.util.Collections"), n = Java.use("java.net.Inet4Address"), i = Java.use("java.net.InterfaceAddress"), v = Java.use("java.net.InetAddress"), c = Java.use("java.net.Inet6Address");
    function d(t, e) {
      var r = (0, a.getDeclaredMethod)(v, "getByName(java.lang.String)").invoke(null, [ t ]), s = Java.cast(r, c).getAddress();
      return c.$new(t, s, e);
    }
    let u = function() {
      let a = n.getByName(t._wlan0_ipv4_str), r = d(t._wlan0_ipv6, 26), s = Java.array("Ljava.net.InetAddress;", [ r, a ]), _ = e.$new("wlan0", 3, s), v = Java.array("byte", t.macStrToMacList(t._mac_addr));
      _.hardwareAddr.value = v;
      let c = n.getByName(t._wlan0_ipv4_broadcast_str), u = n.getByName(t._wlan0_ipv4_netmask_str), l = i.$new(a, c, u);
      return _.bindings.value = Java.array("Ljava.net.InterfaceAddress;", [ l ]), _;
    }(), l = function() {
      let a = n.getByName(t._fuck_ipv4_str), r = d(t._fuck_ipv6, 3), s = Java.array("Ljava.net.InetAddress;", [ r ]), _ = e.$new("dummy0", 1, s), v = Java.array("byte", t.macStrToMacList(t._fuck_mac));
      _.hardwareAddr.value = v;
      let c = n.getByName(t._fuck_ipv4_broadcast_str), u = n.getByName(t._fuck_ipv4_netmask_str), l = i.$new(a, c, u);
      return _.bindings.value = Java.array("Ljava.net.InterfaceAddress;", [ l ]), _;
    }();
    e.getNetworkInterfaces.overload().implementation = function() {
      var a = r.$new(), t = Java.cast(a, s);
      return t.add(l), t.add(u), _.enumeration(t);
    };
  }
}

exports.HookGetNetworkInterfaces = t;

},{"../../../../utils/ReflectTool":85}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookAccess = void 0;

const t = require("../..");

class e {
  _endsWithPathList;
  _indexOfPathList;
  constructor(t, e) {
    this._endsWithPathList = t, this._indexOfPathList = e;
  }
  startHook() {
    let e = this;
    const i = Module.getExportByName("libc.so", "access"), s = new NativeFunction(i, "pointer", [ "pointer", "pointer" ]);
    Interceptor.replace(i, new NativeCallback(((i, n) => {
      const r = i.readUtf8String();
      let o;
      for (let i in e._endsWithPathList) if (r.endsWith(e._endsWithPathList[i])) return (0, 
      t.xPrint)("[access] 拦截 :", r, "->", e._endsWithPathList[i]), o = ptr(-1), o;
      for (let i in e._indexOfPathList) if (-1 != r.indexOf(e._indexOfPathList[i])) return (0, 
      t.xPrint)("[access] 拦截 :", r, "->", e._indexOfPathList[i]), o = ptr(-1), o;
      return o = s(i, n), o;
    }), "pointer", [ "pointer", "pointer" ]));
  }
}

exports.HookAccess = e;

},{"../..":78}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookOpen = void 0;

const e = require("../..");

class t {
  _fileRedirectDict;
  constructor(e) {
    this._fileRedirectDict = e;
  }
  filterFile(e, t, i, o, n, r, c) {
    let l = "", f = Memory.alloc(256), s = e(Memory.allocUtf8String(n), Memory.allocUtf8String("r"));
    for (;0 == t(s); ) {
      const e = f.readUtf8String();
      let t = !1;
      for (let i in c) if (e.indexOf(c[i]) > -1) {
        t = !0;
        break;
      }
      t || (l += e);
    }
    o(s);
    const p = new File(r, "w");
    p.write(l), p.flush(), p.close();
  }
  startHook() {
    const t = this;
    let i = Module.findExportByName("libc.so", "fopen"), o = Module.findExportByName("libc.so", "fclose"), n = Module.findExportByName("libc.so", "feof"), r = Module.findExportByName("libc.so", "fgets"), c = new NativeFunction(i, "pointer", [ "pointer", "pointer" ]), l = new NativeFunction(o, "pointer", [ "pointer" ]), f = new NativeFunction(n, "pointer", [ "pointer" ]), s = new NativeFunction(r, "pointer", [ "pointer", "pointer", "pointer" ]);
    const p = {};
    for (let e in this._fileRedirectDict) {
      const t = this._fileRedirectDict[e][0];
      p.hasOwnProperty(t) || (p[t] = Memory.allocUtf8String(t));
    }
    Interceptor.attach(Module.findExportByName("libc.so", "open"), {
      onEnter: function(i) {
        let o = i[0].readCString();
        if (t._fileRedirectDict.hasOwnProperty(o)) {
          const n = t._fileRedirectDict[o];
          2 == n.length && (0 == n[1].length ? (0, e.xPrint)("[**]hi bro, what are you fucking do?") : ((0, 
          e.xPrint)(`[**]open filter: [${o}] -> [${n[0]}], filterWords: ${n[1].join(",")}`), 
          t.filterFile(c, f, s, l, o, n[0], n[1]))), (0, e.xPrint)(`[**]open redirect: [${o}] -> [${n[0]}]`), 
          i[0] = p[n[0]];
        }
      },
      onLeave: function(e) {}
    });
  }
}

exports.HookOpen = t;

},{"../..":78}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookPopen = void 0;

const t = require("../..");

class e {
  _cmdDict;
  constructor(t) {
    this._cmdDict = t;
  }
  startHook() {
    const e = this, r = Module.getExportByName("libc.so", "popen"), o = new NativeFunction(r, "pointer", [ "pointer", "pointer" ]);
    Interceptor.replace(r, new NativeCallback(((r, n) => {
      let i, p, c = r.readUtf8String().trim().replace(/\s+/g, " "), l = c.split(" "), s = "";
      for (let t = 1; t < l.length; t++) t != l.length - 1 ? s += l[t] + " " : s += l[t];
      let a = l[0].split("/"), u = a[a.length - 1];
      if (e._cmdDict.hasOwnProperty(u)) {
        let r = e._cmdDict[u];
        if (r.hasOwnProperty("*")) return p = r["*"] + " " + s, (0, t.xPrint)("[popen]:", c, "已拦截->", p), 
        i = o(Memory.allocUtf8String(p), n), i;
        if (r.hasOwnProperty(s)) return p = r[s], (0, t.xPrint)("[popen]:", c, "已拦截->", p), 
        i = o(Memory.allocUtf8String(p), n), i;
      }
      return (0, t.xPrint)("[popen]:", c, "放过"), i = o(r, n), i;
    }), "pointer", [ "pointer", "pointer" ]));
  }
}

exports.HookPopen = e;

},{"../..":78}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookReadlink = void 0;

class e {
  _fileterFdInfo;
  constructor(e) {
    this._fileterFdInfo = e;
  }
  startHook() {
    let e, t, o = this;
    Interceptor.attach(Module.findExportByName("libc.so", "readlink"), {
      onEnter: function(o) {
        e = o[0], t = o[1];
      },
      onLeave: function(e) {
        let n = t.readCString();
        for (let e in o._fileterFdInfo) -1 != n.indexOf(o._fileterFdInfo[e]) && t.writeUtf8String("anon_inode:[eventfd]");
      }
    });
  }
}

exports.HookReadlink = e;

},{}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookStat = void 0;

const t = require("../..");

class e {
  _endsWithPathList;
  _indexOfPathList;
  constructor(t, e) {
    this._endsWithPathList = t, this._indexOfPathList = e;
  }
  startHook() {
    let e = this;
    const i = Module.getExportByName("libc.so", "stat"), s = new NativeFunction(i, "pointer", [ "pointer", "pointer" ]);
    Interceptor.replace(i, new NativeCallback(((i, n) => {
      const r = i.readUtf8String();
      let o;
      for (let i in e._endsWithPathList) if (r.endsWith(e._endsWithPathList[i])) return (0, 
      t.xPrint)("[access] 拦截 :", r, "->", e._endsWithPathList[i]), o = ptr(-1), o;
      for (let i in e._indexOfPathList) if (-1 != r.indexOf(e._indexOfPathList[i])) return (0, 
      t.xPrint)("[access] 拦截 :", r, "->", e._indexOfPathList[i]), o = ptr(-1), o;
      return o = s(i, n), o;
    }), "pointer", [ "pointer", "pointer" ]));
  }
}

exports.HookStat = e;

},{"../..":78}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSystem = void 0;

const t = require("../..");

class e {
  _cmdDict;
  constructor(t) {
    this._cmdDict = t;
  }
  startHook() {
    const e = this, r = Module.getExportByName("libc.so", "system"), o = new NativeFunction(r, "pointer", [ "pointer" ]);
    Interceptor.replace(r, new NativeCallback((r => {
      let s, i, n = r.readUtf8String().trim().replace(/\s+/g, " "), c = n.split(" "), l = "";
      for (let t = 1; t < c.length; t++) t != c.length - 1 ? l += c[t] + " " : l += c[t];
      let p = c[0].split("/"), a = p[p.length - 1];
      if (e._cmdDict.hasOwnProperty(a)) {
        let r = e._cmdDict[a];
        if (r.hasOwnProperty("*")) return i = r["*"] + " " + l, (0, t.xPrint)("[system]:", n, "已拦截->", i), 
        s = o(Memory.allocUtf8String(i)), s;
        if (r.hasOwnProperty(l)) return i = r[l], (0, t.xPrint)("[system]:", n, "已拦截->", i), 
        s = o(Memory.allocUtf8String(i)), s;
      }
      return (0, t.xPrint)("[system]:", n, "放过"), s = o(r), s;
    }), "pointer", [ "pointer" ]));
  }
}

exports.HookSystem = e;

},{"../..":78}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookSystemPropertyGet = void 0;

const t = require("../..");

class e {
  _buildInfo;
  _blackList;
  _log;
  constructor(t, e, r = !1) {
    this._buildInfo = t, this._blackList = e, this._log = r;
  }
  startHook() {
    let e = this;
    const r = Module.getExportByName("libc.so", "__system_property_get"), o = new NativeFunction(r, "pointer", [ "pointer", "pointer" ]);
    Interceptor.replace(r, new NativeCallback(((r, i) => {
      const s = r.readUtf8String();
      let n;
      if (-1 != e._blackList.indexOf(s)) e._log && (0, t.xPrint)("[__system_property_get] 过滤->", s), 
      i.writeUtf8String(""), n = ptr(0); else if (e._buildInfo.hasOwnProperty(s)) {
        let r = e._buildInfo[s];
        i.writeUtf8String(r), e._log && (0, t.xPrint)("[__system_property_get] 替换->", s, "->", r), 
        n = ptr(r.length);
      } else n = o(r, i), e._log && (0, t.xPrint)("[__system_property_get] 放过->", s, "->", i.readCString());
      return n;
    }), "pointer", [ "pointer", "pointer" ]));
  }
}

exports.HookSystemPropertyGet = e;

},{"../..":78}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookInit = void 0;

const e = require("../..");

class t {
  _hookList;
  constructor(e) {
    this._hookList = e;
  }
  startHook() {
    let t = null, i = null, o = this;
    if (4 == Process.pointerSize ? i = "linker" : 8 == Process.pointerSize && (i = "linker64"), 
    null == i) return void (0, e.xPrint)("[initHook]cannot get linker");
    let n = Process.getModuleByName(i).enumerateSymbols();
    for (let i = 0; i < n.length; i++) n[i].name.indexOf("find_libraries") >= 0 && ((0, 
    e.xPrint)(n[i].name), t = n[i].address, (0, e.xPrint)("[initHook]found findlibraries_addr => ", t));
    null != t ? Interceptor.attach(t, {
      onEnter: function(t) {
        let i = t[2].readPointer();
        if (this.searched = [], void 0 !== i && null != i) {
          let t = i.readCString();
          if (null == t) return;
          (0, e.xPrint)("[initHook]findlibraries start load:", t);
          for (let e = 0; e < o._hookList.length; ++e) {
            let i = o._hookList[e][0];
            void 0 !== i && null != i && t.indexOf(i) >= 0 && this.searched.push(e);
          }
        }
      },
      onLeave: function(t) {
        for (let t = 0; t < this.searched.length; ++t) {
          if (2 != o._hookList[this.searched[t]].length) {
            (0, e.xPrint)("[initHook]list length != 2");
            continue;
          }
          let i = o._hookList[this.searched[t]][0], n = o._hookList[this.searched[t]][1], r = Module.getBaseAddress(i);
          (0, e.xPrint)("[initHook] loaded->", i, r), n(r);
        }
      }
    }) : (0, e.xPrint)("[initHook]findlibraries_addr NOT FOUND!");
  }
}

exports.HookInit = t;

},{"../..":78}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.HookHasIccCard = exports.HookGetSimOperator = exports.HookGetSimCarrierId = exports.HookGetSignalStrength = exports.HookGetNetworkSpecifier = exports.HookGetAllCellInfo = exports.HookGlobalGetInt = exports.HookGetSubscriberId = exports.HookGetSimState = exports.HookGetSimSerialNumber = exports.HookGetSimOperatorName = exports.HookGetSimCountryIso = exports.HookGetPhoneType = exports.HookGetNetworkType = exports.HookGetNetworkOperator = exports.HookGetLine1Number = exports.HookGetImei = exports.HookGetDeviceId = exports.HookGetCurrentPhoneTypeForSlot = exports.HookGetCellLocation = exports.HookGlobalGetString = exports.HookSystemGetString = exports.HookSystemGetInt = exports.HookSecureGetString = exports.HookSecureGetInt = exports.HookBlueToothName = exports.HookSystemPropGet = exports.HookNativeGet = exports.HookGetBlockSize = exports.HookGetAvailableBlocks = exports.HookBuildVersionField = exports.HookBuildField = exports.HookGetScanResults = exports.HookGetConnectionInfo = exports.HookHasTransport = exports.HookGetHttpProxy = exports.HookGetDefaultProxy = exports.HookGetDefaultPort = exports.HookGetDefaultHost = exports.HookGetLongitude = exports.HookGetLatitude = exports.HookDispatchSensorEvent = exports.HookGetPackageNames = exports.HookGetInstallerPackageName = exports.HookGetInstalledPackages = exports.HookGetInstalledApplications = exports.HookQueryIntentActivities = exports.HookGetPackageInfo = exports.HookGetMemoryInfo = exports.RandomLocationFloat = void 0, 
exports.HookSetLongitude = exports.HookInit = exports.getMethodAddr = exports.clearArtMethodHotnessCount = exports.newClass = exports.ActivityRecordUtils = exports.useClassFromAllClassLoader = exports.httpPostAsync = exports.httpGetAsync = exports.httpPost = exports.httpGet = exports.str2BytesObj = exports.printAllFileds = exports.getFiledObj = exports.setLongFiled = exports.setIntFiled = exports.setFatherFiled = exports.setFiled = exports.getDeclaredConstructor = exports.printAllDeclaredConstructors = exports.getDeclaredMethod = exports.printAllDeclaredMethods = exports.printAllDeclaredMethodsInStr = exports.HookOpen = exports.HookSystemPropertyGet = exports.HookSystem = exports.HookStat = exports.HookReadlink = exports.HookAccess = exports.HookPopen = exports.HookGetMode = exports.HookGetStreamVolume = exports.HookPrepareToEnterProcess = exports.printLogArg1 = exports.TEL_LOG = exports.printLog = exports.HookGetTopVisibleActivity = exports.HookGetDrawable = exports.KillMyself = exports.GetAndroidVersionRelease = exports.GetAppArch = exports.GetAppVersionCode = exports.GetAppVersion = exports.HookGetNetworkInterfaces = exports.HookGetHardwareAddress = exports.HookGetProperty = exports.HookRuntimeExec = exports.HookGetOAID = exports.HookGetAppBytes = exports.RandomUtils = void 0, 
exports.HookIsKeyguardSecure = exports.HookQuery = exports.HookLastModified = exports.hookAllMethod = exports.HookGetConfiguredNetworks = exports.initLog = exports.xWarning = exports.xInfo = exports.xError = exports.xDebug = exports.xPrint = exports.GetPackageName = exports.HookSetLatitude = void 0;

const e = require("./HookJava/android/location/Location/RandomLocationFloat");

Object.defineProperty(exports, "RandomLocationFloat", {
  enumerable: !0,
  get: function() {
    return e.RandomLocationFloat;
  }
});

const o = require("./utils/HookHelper");

Object.defineProperty(exports, "clearArtMethodHotnessCount", {
  enumerable: !0,
  get: function() {
    return o.clearArtMethodHotnessCount;
  }
}), Object.defineProperty(exports, "getMethodAddr", {
  enumerable: !0,
  get: function() {
    return o.getMethodAddr;
  }
});

const t = require("./utils/XPrint");

Object.defineProperty(exports, "initLog", {
  enumerable: !0,
  get: function() {
    return t.initLog;
  }
}), Object.defineProperty(exports, "xPrint", {
  enumerable: !0,
  get: function() {
    return t.xPrint;
  }
}), Object.defineProperty(exports, "xDebug", {
  enumerable: !0,
  get: function() {
    return t.xDebug;
  }
}), Object.defineProperty(exports, "xError", {
  enumerable: !0,
  get: function() {
    return t.xError;
  }
}), Object.defineProperty(exports, "xInfo", {
  enumerable: !0,
  get: function() {
    return t.xInfo;
  }
}), Object.defineProperty(exports, "xWarning", {
  enumerable: !0,
  get: function() {
    return t.xWarning;
  }
});

const r = require("./HookJava/android/app/ActivityManager/HookGetMemoryInfo");

Object.defineProperty(exports, "HookGetMemoryInfo", {
  enumerable: !0,
  get: function() {
    return r.HookGetMemoryInfo;
  }
});

const n = require("./HookJava/android/app/ApplicationPackageManager/HookGetInstalledPackages");

Object.defineProperty(exports, "HookGetInstalledPackages", {
  enumerable: !0,
  get: function() {
    return n.HookGetInstalledPackages;
  }
});

const i = require("./HookJava/android/app/ApplicationPackageManager/HookGetInstallerPackageName");

Object.defineProperty(exports, "HookGetInstallerPackageName", {
  enumerable: !0,
  get: function() {
    return i.HookGetInstallerPackageName;
  }
});

const a = require("./HookJava/android/telephony/TelephonyManager/HookGetCellLocation");

Object.defineProperty(exports, "HookGetCellLocation", {
  enumerable: !0,
  get: function() {
    return a.HookGetCellLocation;
  }
});

const s = require("./HookJava/android/telephony/TelephonyManager/HookGetSubscriberId");

Object.defineProperty(exports, "HookGetSubscriberId", {
  enumerable: !0,
  get: function() {
    return s.HookGetSubscriberId;
  }
});

const p = require("./HookJava/android/telephony/TelephonyManager/HookGetSimState");

Object.defineProperty(exports, "HookGetSimState", {
  enumerable: !0,
  get: function() {
    return p.HookGetSimState;
  }
});

const u = require("./HookJava/android/telephony/TelephonyManager/HookGetSimSerialNumber");

Object.defineProperty(exports, "HookGetSimSerialNumber", {
  enumerable: !0,
  get: function() {
    return u.HookGetSimSerialNumber;
  }
});

const c = require("./HookJava/android/telephony/TelephonyManager/HookGetSimOperatorName");

Object.defineProperty(exports, "HookGetSimOperatorName", {
  enumerable: !0,
  get: function() {
    return c.HookGetSimOperatorName;
  }
});

const l = require("./HookJava/android/telephony/TelephonyManager/HookGetSimCountryIso");

Object.defineProperty(exports, "HookGetSimCountryIso", {
  enumerable: !0,
  get: function() {
    return l.HookGetSimCountryIso;
  }
});

const k = require("./HookJava/android/telephony/TelephonyManager/HookGetPhoneType");

Object.defineProperty(exports, "HookGetPhoneType", {
  enumerable: !0,
  get: function() {
    return k.HookGetPhoneType;
  }
});

const d = require("./HookJava/android/telephony/TelephonyManager/HookGetNetworkType");

Object.defineProperty(exports, "HookGetNetworkType", {
  enumerable: !0,
  get: function() {
    return d.HookGetNetworkType;
  }
});

const H = require("./HookJava/android/telephony/TelephonyManager/HookGetNetworkOperator");

Object.defineProperty(exports, "HookGetNetworkOperator", {
  enumerable: !0,
  get: function() {
    return H.HookGetNetworkOperator;
  }
});

const f = require("./HookJava/android/telephony/TelephonyManager/HookGetLine1Number");

Object.defineProperty(exports, "HookGetLine1Number", {
  enumerable: !0,
  get: function() {
    return f.HookGetLine1Number;
  }
});

const b = require("./HookJava/android/telephony/TelephonyManager/HookGetDeviceId");

Object.defineProperty(exports, "HookGetDeviceId", {
  enumerable: !0,
  get: function() {
    return b.HookGetDeviceId;
  }
});

const y = require("./HookJava/android/telephony/TelephonyManager/HookGetImei");

Object.defineProperty(exports, "HookGetImei", {
  enumerable: !0,
  get: function() {
    return y.HookGetImei;
  }
});

const x = require("./HookJava/android/telephony/TelephonyManager/HookGetCurrentPhoneTypeForSlot");

Object.defineProperty(exports, "HookGetCurrentPhoneTypeForSlot", {
  enumerable: !0,
  get: function() {
    return x.HookGetCurrentPhoneTypeForSlot;
  }
});

const g = require("./HookJava/android/content/pm/ChangedPackages/HookGetPackageNames");

Object.defineProperty(exports, "HookGetPackageNames", {
  enumerable: !0,
  get: function() {
    return g.HookGetPackageNames;
  }
});

const G = require("./HookJava/android/hardware/SystemSensorManager/SensorEventQueue/HookDispatchSensorEvent");

Object.defineProperty(exports, "HookDispatchSensorEvent", {
  enumerable: !0,
  get: function() {
    return G.HookDispatchSensorEvent;
  }
});

const m = require("./HookJava/android/location/Location/HookGetLatitude");

Object.defineProperty(exports, "HookGetLatitude", {
  enumerable: !0,
  get: function() {
    return m.HookGetLatitude;
  }
});

const P = require("./HookJava/android/location/Location/HookGetLongitude");

Object.defineProperty(exports, "HookGetLongitude", {
  enumerable: !0,
  get: function() {
    return P.HookGetLongitude;
  }
});

const S = require("./HookJava/android/net/Proxy/HookGetDefaultHost");

Object.defineProperty(exports, "HookGetDefaultHost", {
  enumerable: !0,
  get: function() {
    return S.HookGetDefaultHost;
  }
});

const O = require("./HookJava/android/net/Proxy/HookGetDefaultPort");

Object.defineProperty(exports, "HookGetDefaultPort", {
  enumerable: !0,
  get: function() {
    return O.HookGetDefaultPort;
  }
});

const j = require("./HookJava/android/os/Build/HookBuildField");

Object.defineProperty(exports, "HookBuildField", {
  enumerable: !0,
  get: function() {
    return j.HookBuildField;
  }
});

const v = require("./HookJava/android/net/wifi/WifiManager/HookGetConnectionInfo");

Object.defineProperty(exports, "HookGetConnectionInfo", {
  enumerable: !0,
  get: function() {
    return v.HookGetConnectionInfo;
  }
});

const h = require("./HookJava/android/net/wifi/WifiManager/HookGetScanResults");

Object.defineProperty(exports, "HookGetScanResults", {
  enumerable: !0,
  get: function() {
    return h.HookGetScanResults;
  }
});

const A = require("./HookJava/android/os/StatFs/HookGetAvailableBlocks");

Object.defineProperty(exports, "HookGetAvailableBlocks", {
  enumerable: !0,
  get: function() {
    return A.HookGetAvailableBlocks;
  }
});

const I = require("./HookJava/android/os/StatFs/HookGetBlockSize");

Object.defineProperty(exports, "HookGetBlockSize", {
  enumerable: !0,
  get: function() {
    return I.HookGetBlockSize;
  }
});

const q = require("./HookJava/android/os/SystemProperties/HookNativeGet");

Object.defineProperty(exports, "HookNativeGet", {
  enumerable: !0,
  get: function() {
    return q.HookNativeGet;
  }
});

const M = require("./HookJava/android/os/SystemProperties/HookSystemPropGet");

Object.defineProperty(exports, "HookSystemPropGet", {
  enumerable: !0,
  get: function() {
    return M.HookSystemPropGet;
  }
});

const J = require("./HookJava/android/provider/Settings/Secure/HookSecureGetInt");

Object.defineProperty(exports, "HookSecureGetInt", {
  enumerable: !0,
  get: function() {
    return J.HookSecureGetInt;
  }
});

const N = require("./HookJava/android/provider/Settings/Secure/HookSecureGetString");

Object.defineProperty(exports, "HookSecureGetString", {
  enumerable: !0,
  get: function() {
    return N.HookSecureGetString;
  }
});

const L = require("./HookJava/android/provider/Settings/System/HookSystemGetInt");

Object.defineProperty(exports, "HookSystemGetInt", {
  enumerable: !0,
  get: function() {
    return L.HookSystemGetInt;
  }
});

const C = require("./HookJava/android/provider/Settings/System/HookSystemGetString");

Object.defineProperty(exports, "HookSystemGetString", {
  enumerable: !0,
  get: function() {
    return C.HookSystemGetString;
  }
});

const T = require("./HookJava/android/provider/Settings/Global/HookGlobalGetString");

Object.defineProperty(exports, "HookGlobalGetString", {
  enumerable: !0,
  get: function() {
    return T.HookGlobalGetString;
  }
});

const D = require("./HookJava/com/android/id/impl/IdProviderImpl/HookGetOAID");

Object.defineProperty(exports, "HookGetOAID", {
  enumerable: !0,
  get: function() {
    return D.HookGetOAID;
  }
});

const F = require("./HookJava/java/lang/Runtime/HookRuntimeExec");

Object.defineProperty(exports, "HookRuntimeExec", {
  enumerable: !0,
  get: function() {
    return F.HookRuntimeExec;
  }
});

const w = require("./HookJava/java/lang/System/HookGetProperty");

Object.defineProperty(exports, "HookGetProperty", {
  enumerable: !0,
  get: function() {
    return w.HookGetProperty;
  }
});

const B = require("./HookJava/java/net/NetworkInterface/HookGetHardwareAddress");

Object.defineProperty(exports, "HookGetHardwareAddress", {
  enumerable: !0,
  get: function() {
    return B.HookGetHardwareAddress;
  }
});

const R = require("./HookJava/java/net/NetworkInterface/HookGetNetworkInterfaces");

Object.defineProperty(exports, "HookGetNetworkInterfaces", {
  enumerable: !0,
  get: function() {
    return R.HookGetNetworkInterfaces;
  }
});

const V = require("./HookJava/android/telephony/TelephonyManager/PrintLog");

Object.defineProperty(exports, "printLog", {
  enumerable: !0,
  get: function() {
    return V.printLog;
  }
}), Object.defineProperty(exports, "printLogArg1", {
  enumerable: !0,
  get: function() {
    return V.printLogArg1;
  }
}), Object.defineProperty(exports, "TEL_LOG", {
  enumerable: !0,
  get: function() {
    return V.TEL_LOG;
  }
});

const E = require("./HookJava/android/telephony/TelephonyManager/HookGetAllCellInfo");

Object.defineProperty(exports, "HookGetAllCellInfo", {
  enumerable: !0,
  get: function() {
    return E.HookGetAllCellInfo;
  }
});

const U = require("./HookJava/android/telephony/TelephonyManager/HookGetNetworkSpecifier");

Object.defineProperty(exports, "HookGetNetworkSpecifier", {
  enumerable: !0,
  get: function() {
    return U.HookGetNetworkSpecifier;
  }
});

const Q = require("./HookJava/android/telephony/TelephonyManager/HookGetSignalStrength");

Object.defineProperty(exports, "HookGetSignalStrength", {
  enumerable: !0,
  get: function() {
    return Q.HookGetSignalStrength;
  }
});

const K = require("./HookJava/android/telephony/TelephonyManager/HookGetSimCarrierId");

Object.defineProperty(exports, "HookGetSimCarrierId", {
  enumerable: !0,
  get: function() {
    return K.HookGetSimCarrierId;
  }
});

const W = require("./HookJava/android/telephony/TelephonyManager/HookGetSimOperator");

Object.defineProperty(exports, "HookGetSimOperator", {
  enumerable: !0,
  get: function() {
    return W.HookGetSimOperator;
  }
});

const _ = require("./HookJava/android/telephony/TelephonyManager/HookHasIccCard");

Object.defineProperty(exports, "HookHasIccCard", {
  enumerable: !0,
  get: function() {
    return _.HookHasIccCard;
  }
});

const z = require("./HookJava/android/content/Intent/HookPrepareToEnterProcess");

Object.defineProperty(exports, "HookPrepareToEnterProcess", {
  enumerable: !0,
  get: function() {
    return z.HookPrepareToEnterProcess;
  }
});

const X = require("./utils/ReflectTool");

Object.defineProperty(exports, "getDeclaredConstructor", {
  enumerable: !0,
  get: function() {
    return X.getDeclaredConstructor;
  }
}), Object.defineProperty(exports, "getDeclaredMethod", {
  enumerable: !0,
  get: function() {
    return X.getDeclaredMethod;
  }
}), Object.defineProperty(exports, "getFiledObj", {
  enumerable: !0,
  get: function() {
    return X.getFiledObj;
  }
}), Object.defineProperty(exports, "printAllDeclaredConstructors", {
  enumerable: !0,
  get: function() {
    return X.printAllDeclaredConstructors;
  }
}), Object.defineProperty(exports, "printAllDeclaredMethods", {
  enumerable: !0,
  get: function() {
    return X.printAllDeclaredMethods;
  }
}), Object.defineProperty(exports, "printAllDeclaredMethodsInStr", {
  enumerable: !0,
  get: function() {
    return X.printAllDeclaredMethodsInStr;
  }
}), Object.defineProperty(exports, "printAllFileds", {
  enumerable: !0,
  get: function() {
    return X.printAllFileds;
  }
}), Object.defineProperty(exports, "setFatherFiled", {
  enumerable: !0,
  get: function() {
    return X.setFatherFiled;
  }
}), Object.defineProperty(exports, "setFiled", {
  enumerable: !0,
  get: function() {
    return X.setFiled;
  }
}), Object.defineProperty(exports, "setIntFiled", {
  enumerable: !0,
  get: function() {
    return X.setIntFiled;
  }
}), Object.defineProperty(exports, "setLongFiled", {
  enumerable: !0,
  get: function() {
    return X.setLongFiled;
  }
}), Object.defineProperty(exports, "str2BytesObj", {
  enumerable: !0,
  get: function() {
    return X.str2BytesObj;
  }
});

const Y = require("./HookJava/android/app/WallpaperManager/HookGetDrawable");

Object.defineProperty(exports, "HookGetDrawable", {
  enumerable: !0,
  get: function() {
    return Y.HookGetDrawable;
  }
});

const Z = require("./HookJava/android/app/IActivityTaskManager/HookGetTopVisibleActivity");

Object.defineProperty(exports, "HookGetTopVisibleActivity", {
  enumerable: !0,
  get: function() {
    return Z.HookGetTopVisibleActivity;
  }
});

const $ = require("./utils/AppTool");

Object.defineProperty(exports, "GetAndroidVersionRelease", {
  enumerable: !0,
  get: function() {
    return $.GetAndroidVersionRelease;
  }
}), Object.defineProperty(exports, "GetAppArch", {
  enumerable: !0,
  get: function() {
    return $.GetAppArch;
  }
}), Object.defineProperty(exports, "GetAppVersion", {
  enumerable: !0,
  get: function() {
    return $.GetAppVersion;
  }
}), Object.defineProperty(exports, "GetAppVersionCode", {
  enumerable: !0,
  get: function() {
    return $.GetAppVersionCode;
  }
}), Object.defineProperty(exports, "GetPackageName", {
  enumerable: !0,
  get: function() {
    return $.GetPackageName;
  }
}), Object.defineProperty(exports, "KillMyself", {
  enumerable: !0,
  get: function() {
    return $.KillMyself;
  }
});

const ee = require("./HookJava/android/provider/Settings/Global/HookGlobalGetInt");

Object.defineProperty(exports, "HookGlobalGetInt", {
  enumerable: !0,
  get: function() {
    return ee.HookGlobalGetInt;
  }
});

const oe = require("./utils/newClass");

Object.defineProperty(exports, "newClass", {
  enumerable: !0,
  get: function() {
    return oe.newClass;
  }
});

const te = require("./HookJava/android/app/usage/StorageStats/HookGetAppBytes");

Object.defineProperty(exports, "HookGetAppBytes", {
  enumerable: !0,
  get: function() {
    return te.HookGetAppBytes;
  }
});

const re = require("./HookJava/android/app/ApplicationPackageManager/HookGetPackageInfo");

Object.defineProperty(exports, "HookGetPackageInfo", {
  enumerable: !0,
  get: function() {
    return re.HookGetPackageInfo;
  }
});

const ne = require("./HookJava/java/io/File/HookLastModified");

Object.defineProperty(exports, "HookLastModified", {
  enumerable: !0,
  get: function() {
    return ne.HookLastModified;
  }
});

const ie = require("./HookJava/android/app/ApplicationPackageManager/HookQueryIntentActivities");

Object.defineProperty(exports, "HookQueryIntentActivities", {
  enumerable: !0,
  get: function() {
    return ie.HookQueryIntentActivities;
  }
});

const ae = require("./HookNative/linker/HookInit");

Object.defineProperty(exports, "HookInit", {
  enumerable: !0,
  get: function() {
    return ae.HookInit;
  }
});

const se = require("./HookJava/android/location/Location/HookSetLongitude");

Object.defineProperty(exports, "HookSetLongitude", {
  enumerable: !0,
  get: function() {
    return se.HookSetLongitude;
  }
});

const pe = require("./HookJava/android/location/Location/HookSetLatitude");

Object.defineProperty(exports, "HookSetLatitude", {
  enumerable: !0,
  get: function() {
    return pe.HookSetLatitude;
  }
});

const ue = require("./HookJava/android/net/wifi/WifiManager/HookGetConfiguredNetworks");

Object.defineProperty(exports, "HookGetConfiguredNetworks", {
  enumerable: !0,
  get: function() {
    return ue.HookGetConfiguredNetworks;
  }
});

const ce = require("./HookJava/android/app/ContextImpl/ApplicationContentResolver/HookQuery");

Object.defineProperty(exports, "HookQuery", {
  enumerable: !0,
  get: function() {
    return ce.HookQuery;
  }
});

const le = require("./HookJava/android/os/Build/HookBuildVersionField");

Object.defineProperty(exports, "HookBuildVersionField", {
  enumerable: !0,
  get: function() {
    return le.HookBuildVersionField;
  }
});

const ke = require("./HookJava/android/bluetooth/BluetoothAdapter/HookBlueToothName");

Object.defineProperty(exports, "HookBlueToothName", {
  enumerable: !0,
  get: function() {
    return ke.HookBlueToothName;
  }
});

const de = require("./HookJava/android/media/AudioManager/HookGetStreamVolume");

Object.defineProperty(exports, "HookGetStreamVolume", {
  enumerable: !0,
  get: function() {
    return de.HookGetStreamVolume;
  }
});

const He = require("./HookJava/android/media/AudioManager/HookGetMode");

Object.defineProperty(exports, "HookGetMode", {
  enumerable: !0,
  get: function() {
    return He.HookGetMode;
  }
});

const fe = require("./HookJava/android/net/ConnectivityManager/HookGetDefaultProxy");

Object.defineProperty(exports, "HookGetDefaultProxy", {
  enumerable: !0,
  get: function() {
    return fe.HookGetDefaultProxy;
  }
});

const be = require("./HookJava/android/net/LinkProperties/HookGetHttpProxy");

Object.defineProperty(exports, "HookGetHttpProxy", {
  enumerable: !0,
  get: function() {
    return be.HookGetHttpProxy;
  }
});

const ye = require("./HookJava/android/net/NetworkCapabilities/HookHasTransport");

Object.defineProperty(exports, "HookHasTransport", {
  enumerable: !0,
  get: function() {
    return ye.HookHasTransport;
  }
});

const xe = require("./HookJava/android/app/KeyguardManager/HookIsKeyguardSecure");

Object.defineProperty(exports, "HookIsKeyguardSecure", {
  enumerable: !0,
  get: function() {
    return xe.HookIsKeyguardSecure;
  }
});

const ge = require("./HookJava/android/app/ApplicationPackageManager/HookGetInstalledApplications");

Object.defineProperty(exports, "HookGetInstalledApplications", {
  enumerable: !0,
  get: function() {
    return ge.HookGetInstalledApplications;
  }
});

const Ge = require("./utils/HttpUtil");

Object.defineProperty(exports, "httpGet", {
  enumerable: !0,
  get: function() {
    return Ge.httpGet;
  }
}), Object.defineProperty(exports, "httpGetAsync", {
  enumerable: !0,
  get: function() {
    return Ge.httpGetAsync;
  }
}), Object.defineProperty(exports, "httpPost", {
  enumerable: !0,
  get: function() {
    return Ge.httpPost;
  }
}), Object.defineProperty(exports, "httpPostAsync", {
  enumerable: !0,
  get: function() {
    return Ge.httpPostAsync;
  }
});

const me = require("./HookNative/libc/HookOpen");

Object.defineProperty(exports, "HookOpen", {
  enumerable: !0,
  get: function() {
    return me.HookOpen;
  }
});

const Pe = require("./HookNative/libc/HookPopen");

Object.defineProperty(exports, "HookPopen", {
  enumerable: !0,
  get: function() {
    return Pe.HookPopen;
  }
});

const Se = require("./HookNative/libc/HookReadlink");

Object.defineProperty(exports, "HookReadlink", {
  enumerable: !0,
  get: function() {
    return Se.HookReadlink;
  }
});

const Oe = require("./HookNative/libc/HookStat");

Object.defineProperty(exports, "HookStat", {
  enumerable: !0,
  get: function() {
    return Oe.HookStat;
  }
});

const je = require("./HookNative/libc/HookSystem");

Object.defineProperty(exports, "HookSystem", {
  enumerable: !0,
  get: function() {
    return je.HookSystem;
  }
});

const ve = require("./HookNative/libc/HookSystemPropertyGet");

Object.defineProperty(exports, "HookSystemPropertyGet", {
  enumerable: !0,
  get: function() {
    return ve.HookSystemPropertyGet;
  }
});

const he = require("./utils/ActivityUtil");

Object.defineProperty(exports, "ActivityRecordUtils", {
  enumerable: !0,
  get: function() {
    return he.ActivityRecordUtils;
  }
});

const Ae = require("./utils/RandomUtil");

Object.defineProperty(exports, "RandomUtils", {
  enumerable: !0,
  get: function() {
    return Ae.RandomUtils;
  }
});

const Ie = require("./utils/TraceUtil");

Object.defineProperty(exports, "hookAllMethod", {
  enumerable: !0,
  get: function() {
    return Ie.hookAllMethod;
  }
});

const qe = require("./HookNative/libc/HookAccess");

Object.defineProperty(exports, "HookAccess", {
  enumerable: !0,
  get: function() {
    return qe.HookAccess;
  }
});

const Me = require("./utils/LoaderUtil");

Object.defineProperty(exports, "useClassFromAllClassLoader", {
  enumerable: !0,
  get: function() {
    return Me.useClassFromAllClassLoader;
  }
});

},{"./HookJava/android/app/ActivityManager/HookGetMemoryInfo":2,"./HookJava/android/app/ApplicationPackageManager/HookGetInstalledApplications":3,"./HookJava/android/app/ApplicationPackageManager/HookGetInstalledPackages":4,"./HookJava/android/app/ApplicationPackageManager/HookGetInstallerPackageName":5,"./HookJava/android/app/ApplicationPackageManager/HookGetPackageInfo":6,"./HookJava/android/app/ApplicationPackageManager/HookQueryIntentActivities":7,"./HookJava/android/app/ContextImpl/ApplicationContentResolver/HookQuery":8,"./HookJava/android/app/IActivityTaskManager/HookGetTopVisibleActivity":9,"./HookJava/android/app/KeyguardManager/HookIsKeyguardSecure":10,"./HookJava/android/app/WallpaperManager/HookGetDrawable":11,"./HookJava/android/app/usage/StorageStats/HookGetAppBytes":12,"./HookJava/android/bluetooth/BluetoothAdapter/HookBlueToothName":13,"./HookJava/android/content/Intent/HookPrepareToEnterProcess":14,"./HookJava/android/content/pm/ChangedPackages/HookGetPackageNames":15,"./HookJava/android/hardware/SystemSensorManager/SensorEventQueue/HookDispatchSensorEvent":16,"./HookJava/android/location/Location/HookGetLatitude":17,"./HookJava/android/location/Location/HookGetLongitude":18,"./HookJava/android/location/Location/HookSetLatitude":19,"./HookJava/android/location/Location/HookSetLongitude":20,"./HookJava/android/location/Location/RandomLocationFloat":21,"./HookJava/android/media/AudioManager/HookGetMode":22,"./HookJava/android/media/AudioManager/HookGetStreamVolume":23,"./HookJava/android/net/ConnectivityManager/HookGetDefaultProxy":24,"./HookJava/android/net/LinkProperties/HookGetHttpProxy":25,"./HookJava/android/net/NetworkCapabilities/HookHasTransport":26,"./HookJava/android/net/Proxy/HookGetDefaultHost":27,"./HookJava/android/net/Proxy/HookGetDefaultPort":28,"./HookJava/android/net/wifi/WifiManager/HookGetConfiguredNetworks":29,"./HookJava/android/net/wifi/WifiManager/HookGetConnectionInfo":30,"./HookJava/android/net/wifi/WifiManager/HookGetScanResults":31,"./HookJava/android/os/Build/HookBuildField":32,"./HookJava/android/os/Build/HookBuildVersionField":33,"./HookJava/android/os/StatFs/HookGetAvailableBlocks":34,"./HookJava/android/os/StatFs/HookGetBlockSize":35,"./HookJava/android/os/SystemProperties/HookNativeGet":36,"./HookJava/android/os/SystemProperties/HookSystemPropGet":37,"./HookJava/android/provider/Settings/Global/HookGlobalGetInt":38,"./HookJava/android/provider/Settings/Global/HookGlobalGetString":39,"./HookJava/android/provider/Settings/Secure/HookSecureGetInt":40,"./HookJava/android/provider/Settings/Secure/HookSecureGetString":41,"./HookJava/android/provider/Settings/System/HookSystemGetInt":42,"./HookJava/android/provider/Settings/System/HookSystemGetString":43,"./HookJava/android/telephony/TelephonyManager/HookGetAllCellInfo":44,"./HookJava/android/telephony/TelephonyManager/HookGetCellLocation":45,"./HookJava/android/telephony/TelephonyManager/HookGetCurrentPhoneTypeForSlot":46,"./HookJava/android/telephony/TelephonyManager/HookGetDeviceId":47,"./HookJava/android/telephony/TelephonyManager/HookGetImei":48,"./HookJava/android/telephony/TelephonyManager/HookGetLine1Number":49,"./HookJava/android/telephony/TelephonyManager/HookGetNetworkOperator":50,"./HookJava/android/telephony/TelephonyManager/HookGetNetworkSpecifier":51,"./HookJava/android/telephony/TelephonyManager/HookGetNetworkType":52,"./HookJava/android/telephony/TelephonyManager/HookGetPhoneType":53,"./HookJava/android/telephony/TelephonyManager/HookGetSignalStrength":54,"./HookJava/android/telephony/TelephonyManager/HookGetSimCarrierId":55,"./HookJava/android/telephony/TelephonyManager/HookGetSimCountryIso":56,"./HookJava/android/telephony/TelephonyManager/HookGetSimOperator":57,"./HookJava/android/telephony/TelephonyManager/HookGetSimOperatorName":58,"./HookJava/android/telephony/TelephonyManager/HookGetSimSerialNumber":59,"./HookJava/android/telephony/TelephonyManager/HookGetSimState":60,"./HookJava/android/telephony/TelephonyManager/HookGetSubscriberId":61,"./HookJava/android/telephony/TelephonyManager/HookHasIccCard":62,"./HookJava/android/telephony/TelephonyManager/PrintLog":63,"./HookJava/com/android/id/impl/IdProviderImpl/HookGetOAID":64,"./HookJava/java/io/File/HookLastModified":65,"./HookJava/java/lang/Runtime/HookRuntimeExec":66,"./HookJava/java/lang/System/HookGetProperty":67,"./HookJava/java/net/NetworkInterface/HookGetHardwareAddress":68,"./HookJava/java/net/NetworkInterface/HookGetNetworkInterfaces":69,"./HookNative/libc/HookAccess":70,"./HookNative/libc/HookOpen":71,"./HookNative/libc/HookPopen":72,"./HookNative/libc/HookReadlink":73,"./HookNative/libc/HookStat":74,"./HookNative/libc/HookSystem":75,"./HookNative/libc/HookSystemPropertyGet":76,"./HookNative/linker/HookInit":77,"./utils/ActivityUtil":79,"./utils/AppTool":80,"./utils/HookHelper":81,"./utils/HttpUtil":82,"./utils/LoaderUtil":83,"./utils/RandomUtil":84,"./utils/ReflectTool":85,"./utils/TraceUtil":86,"./utils/XPrint":87,"./utils/newClass":88}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ActivityRecordUtils = void 0;

const t = require("./newClass"), i = require("./XPrint");

class n {
  activityList;
  dialogMap;
  application;
  constructor(t) {
    this.activityList = Java.use("java.util.LinkedList").$new(), this.dialogMap = Java.use("java.util.concurrent.ConcurrentHashMap").$new(), 
    this.application = Java.cast(t, Java.use("android.app.Application")), t.registerActivityLifecycleCallbacks(this.registerActivityLifecycle().$new());
  }
  getActivityList() {
    return this.activityList;
  }
  getTopActivity() {
    try {
      return Java.cast(this.activityList.getLast(), Java.use("android.app.Activity"));
    } catch (t) {
      return null;
    }
  }
  showDialogOnTopActivity(t, n, e = !1) {
    const s = this.getTopActivity();
    if (null != s) {
      const i = new a(t, n, s, e, this.dialogMap);
      s.runOnUiThread(a.getRunnableClass(i).$new());
    } else (0, i.xPrint)("[showDialogOnTopActivity] top activity is null");
  }
  showToastOnTopActivity(t, n = !1) {
    const a = this.getTopActivity();
    if (null != a) {
      const i = new e(a, t, n);
      a.runOnUiThread(e.getRunnableClass(i).$new());
    } else (0, i.xPrint)("[showToastOnTopActivity] top activity is null");
  }
  registerActivityLifecycle() {
    const t = this;
    return Java.registerClass({
      name: "tencent.application.callbacks.ActivityLifecycleCallbackImpl",
      implements: [ Java.use("android.app.Application$ActivityLifecycleCallbacks") ],
      methods: {
        onActivityCreated: {
          argumentTypes: [ "android.app.Activity", "android.os.Bundle" ],
          returnType: "void",
          implementation: function(n, e) {
            (0, i.xPrint)("enter activity:", JSON.stringify(n)), t.activityList.add(n);
          }
        },
        onActivityDestroyed: {
          argumentTypes: [ "android.app.Activity" ],
          returnType: "void",
          implementation: function(n) {
            (0, i.xPrint)("exit activity:", JSON.stringify(n)), t.activityList.remove(n);
          }
        },
        onActivityStarted: function(t) {},
        onActivityResumed: function(t) {},
        onActivityPaused: function(t) {},
        onActivityStopped: function(t) {},
        onActivityPostStarted: function(t) {},
        onActivityPreStarted: function(t) {},
        onActivityPostStopped: function(t) {},
        onActivityPrePaused: function(t) {},
        onActivityPreStopped: function(t) {},
        onActivityPreDestroyed: function(t) {},
        onActivityPostResumed: function(t) {},
        onActivityPostCreated: function(t, i) {},
        onActivityPreCreated: function(t, i) {},
        onActivityPreResumed: function(t) {},
        onActivityPreSaveInstanceState: function(t, i) {},
        onActivitySaveInstanceState: function(t, i) {},
        onActivityPostSaveInstanceState: function(t, i) {},
        onActivityPostPaused: function(t, i) {},
        onActivityPostDestroyed: function(t) {}
      }
    });
  }
}

exports.ActivityRecordUtils = n;

class e {
  static classInstance=null;
  activity;
  text;
  durationForLong;
  constructor(t, i, n) {
    this.activity = t, this.text = i, this.durationForLong = n;
  }
  static getRunnableClass(i) {
    return this.classInstance || (this.classInstance = t.newClass.createRunnableClass((() => {
      Java.use("android.widget.Toast").makeText(i.activity, Java.use("java.lang.String").$new(i.text), i.durationForLong ? 1 : 0).show();
    }))), this.classInstance;
  }
}

class a {
  static classInstance=null;
  title;
  buttonText;
  activity;
  cancelOutside;
  dialogMap;
  constructor(t, i, n, e, a) {
    this.title = t, this.buttonText = i, this.activity = n, this.cancelOutside = e, 
    this.dialogMap = a;
  }
  static getRunnableClass(n) {
    if (!this.classInstance) {
      const e = Java.registerClass({
        name: "com.tencent.dialog.OnclickListenerImpl",
        implements: [ Java.use("android.content.DialogInterface$OnClickListener") ],
        methods: {
          onClick: function(t, i) {
            t.dismiss();
          }
        }
      });
      return t.newClass.createRunnableClass((() => {
        const t = n.dialogMap.get(n.title);
        if (null != t && Java.cast(t, Java.use("android.app.AlertDialog")).isShowing()) return void (0, 
        i.xPrint)("dialog正在显示着呢, title:", n.title);
        const a = Java.use("android.app.AlertDialog$Builder").$new(n.activity);
        a.setTitle(Java.use("java.lang.String").$new(n.title)), a.setCancelable(!1), a.setPositiveButton(Java.use("java.lang.String").$new(n.buttonText), e.$new());
        const s = a.create();
        s.setCanceledOnTouchOutside(n.cancelOutside), n.dialogMap.put(n.title, s), s.show();
      }));
    }
    return this.classInstance;
  }
}

},{"./XPrint":87,"./newClass":88}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.KillMyself = exports.GetAndroidVersionRelease = exports.GetPackageName = exports.GetAppArch = exports.GetAppVersionCode = exports.GetAppVersion = void 0;

const e = require("./ReflectTool");

class t {
  startHook() {
    const t = (0, e.getDeclaredMethod)(Java.use("android.app.ActivityThread"), "currentActivityThread").invoke(null, []), a = (0, 
    e.getDeclaredMethod)(Java.use(t.getClass().getName()), "getSystemContext"), o = (0, 
    e.getDeclaredMethod)(Java.use(t.getClass().getName()), "currentPackageName"), s = Java.cast(a.invoke(t, []), Java.use("android.content.Context")), r = o.invoke(t, []);
    return s.getPackageManager().getPackageInfo(r, 0).versionName.value;
  }
}

exports.GetAppVersion = t;

class a {
  startHook() {
    const t = (0, e.getDeclaredMethod)(Java.use("android.app.ActivityThread"), "currentActivityThread").invoke(null, []), a = (0, 
    e.getDeclaredMethod)(Java.use(t.getClass().getName()), "getSystemContext"), o = (0, 
    e.getDeclaredMethod)(Java.use(t.getClass().getName()), "currentPackageName"), s = Java.cast(a.invoke(t, []), Java.use("android.content.Context")), r = o.invoke(t, []);
    return s.getPackageManager().getPackageInfo(r, 0).versionCode.value;
  }
}

exports.GetAppVersionCode = a;

class o {
  startHook() {
    return Java.use("android.os.Process").is64Bit() ? "arm64" : "arm32";
  }
}

exports.GetAppArch = o;

class s {
  startHook() {
    const t = (0, e.getDeclaredMethod)(Java.use("android.app.ActivityThread"), "currentActivityThread").invoke(null, []), a = (0, 
    e.getDeclaredMethod)(Java.use(t.getClass().getName()), "getSystemContext"), o = (0, 
    e.getDeclaredMethod)(Java.use(t.getClass().getName()), "currentPackageName");
    Java.cast(a.invoke(t, []), Java.use("android.content.Context"));
    return o.invoke(t, []);
  }
}

exports.GetPackageName = s;

class r {
  startHook() {
    return Java.use("android.os.Build$VERSION").RELEASE.value;
  }
}

exports.GetAndroidVersionRelease = r;

class n {
  startHook() {
    new NativeFunction(Module.getExportByName("libc.so", "kill"), "int", [ "int", "int" ])(0, 9);
  }
}

exports.KillMyself = n;

},{"./ReflectTool":85}],81:[function(require,module,exports){
"use strict";

function e(e, t, o) {
  const r = Java.vm.getEnv(), d = r.findClass(e.replace(/\./g, "/"));
  return ptr(r.getMethodId(d, t, o));
}

function t(e) {
  e.add(18).writeS16(0);
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.clearArtMethodHotnessCount = exports.getMethodAddr = void 0, exports.getMethodAddr = e, 
exports.clearArtMethodHotnessCount = t;

},{}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.httpPostAsync = exports.httpGetAsync = exports.httpPost = exports.httpGet = void 0;

let t, e, n, o, r, s, u = !1;

function c() {
  u || (u = !0, t = Java.use("java.net.URL"), e = Java.use("java.net.HttpURLConnection"), 
  n = Java.use("android.util.Log"), o = Java.use("java.lang.String"), r = Java.use("java.io.BufferedReader"), 
  s = Java.use("java.io.InputStreamReader"));
}

function a(t, e) {
  return f(d(t, e, "GET", ""));
}

function i(t, e, n) {
  return f(d(t, e, "POST", n));
}

function p(t, e, n) {
  setTimeout((function() {
    let o;
    try {
      o = a(t, e);
    } catch (t) {
      return void (n && n.onError && n.onError(t));
    }
    n && n.onSuccess && n.onSuccess(o);
  }), 300);
}

function l(t, e, n, o) {
  setTimeout((function() {
    let r;
    try {
      r = i(t, e, n);
    } catch (t) {
      return void (o && o.onError && o.onError(t));
    }
    o && o.onSuccess && o.onSuccess(r);
  }), 300);
}

function d(t, e, n, o) {
  return {
    url: t,
    headers: e,
    method: n,
    body: o
  };
}

function f(o) {
  c();
  const r = o.url, s = o.headers, u = o.method, a = o.body, i = t.$new(r), p = Java.cast(i.openConnection(), e);
  p.setRequestMethod(u), p.setConnectTimeout(3e3), p.setUseCaches(!1), p.setDoOutput("POST" == u), 
  p.setDoInput(!0), S(p, s), p.connect(), "POST" == u && h(p, a);
  v(p);
  const l = p.getResponseCode(), d = y(l, p);
  return n.v("love-HttpUtil", "url:" + i + ", method:" + u + ", code:" + l), p.disconnect(), 
  d;
}

function h(t, e) {
  const n = t.getOutputStream(), r = o.$new(e);
  n.write(r.getBytes()), n.flush(), n.close();
}

function v(t) {
  let e = {}, n = t.getHeaderFields(), o = n.keySet().iterator();
  for (;o.hasNext(); ) {
    let t = o.next();
    if (null == t) continue;
    let r = n.get(t).toString(), s = r.length;
    e[t] = r.substring(1, s - 1);
  }
  return e;
}

function y(t, e) {
  let n, o = "";
  n = t >= 400 ? r.$new(s.$new(e.getErrorStream())) : r.$new(s.$new(e.getInputStream()));
  let u = "";
  for (;null != (u = n.readLine()); ) o += u + "\n";
  return n.close(), o;
}

function S(t, e) {
  e ? e.hasOwnProperty("Content-Type") || (e["Content-Type"] = "application/json") : e = {
    "Content-Type": "application/json"
  };
  for (let n in e) t.setRequestProperty(n, e[n]);
}

exports.httpGet = a, exports.httpPost = i, exports.httpGetAsync = p, exports.httpPostAsync = l;

},{}],83:[function(require,module,exports){
"use strict";

function e(e, s) {
  Java.classFactory.loader;
  const a = Java.enumerateClassLoadersSync();
  let r = !1;
  for (let s = 0; s < a.length; s++) try {
    a[s].loadClass(e), r = !0;
    break;
  } catch (e) {}
  return r && s(), r;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.useClassFromAllClassLoader = void 0, exports.useClassFromAllClassLoader = e;

},{}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.RandomUtils = void 0;

class t {
  static randomInt(t, e) {
    let o = e - t, r = Math.random();
    return t + Math.round(r * o);
  }
}

exports.RandomUtils = t;

},{}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.str2BytesObj = exports.printAllFileds = exports.getFiledObj = exports.setLongFiled = exports.setIntFiled = exports.setFatherFiled = exports.setFiled = exports.getDeclaredConstructor = exports.printAllDeclaredConstructors = exports.getDeclaredMethod = exports.printAllDeclaredMethods = exports.printAllDeclaredMethodsInStr = void 0;

const e = require("./XPrint");

function t(t, l) {
  let s = t.class.getDeclaredMethods();
  for (let t in s) -1 != s[t].toString().indexOf(l) && (0, e.xPrint)(s[t].toString());
}

function l(t) {
  let l = t.class.getDeclaredMethods();
  for (let t in l) (0, e.xPrint)(l[t].toString());
}

function s(e, t) {
  let l = e.class.getDeclaredMethods();
  for (let e in l) if (-1 != l[e].toString().indexOf(t)) return l[e];
  return null;
}

function r(t, l) {
  let s = t.class.getDeclaredConstructors();
  for (let t in s) -1 != s[t].toString().indexOf(l) && (0, e.xPrint)(s[t].toString());
}

function n(e, t) {
  let l = e.class.getDeclaredConstructors();
  for (let e in l) if (-1 != l[e].toString().indexOf(t)) return l[e];
  return null;
}

function i(e, t, l) {
  let s = e.getClass().getDeclaredField(t);
  s.setAccessible(!0), s.set(e, l);
}

function o(e, t, l) {
  if (null === e) return;
  let s = e.getClass();
  for (;null !== s && !s.equals(Java.use("java.lang.Object").class); ) {
    let r = s.getDeclaredFields();
    if (null !== r && 0 !== r.length) {
      for (let s = 0; s < r.length; s++) {
        let n = r[s];
        if (n.setAccessible(!0), n.getName() == t) return void n.set(e, l);
      }
      s = s.getSuperclass();
    } else s = s.getSuperclass();
  }
}

function c(e, t, l) {
  let s = e.getClass().getDeclaredField(t);
  s.setAccessible(!0), s.setInt(e, l);
}

function a(e, t, l) {
  let s = e.getClass().getDeclaredField(t);
  s.setAccessible(!0), s.setLong(e, l);
}

function u(e, t) {
  if (null === e) return;
  let l = e.getClass();
  for (;null !== l && !l.equals(Java.use("java.lang.Object").class); ) {
    let s = l.getDeclaredFields();
    if (null !== s && 0 !== s.length) {
      for (let l = 0; l < s.length; l++) {
        let r = s[l];
        if (r.setAccessible(!0), r.getName() == t) return r.get(e);
      }
      l = l.getSuperclass();
    } else l = l.getSuperclass();
  }
  return null;
}

function g(t) {
  if (null === t) return;
  let l = t.getClass();
  for (;null !== l && !l.equals(Java.use("java.lang.Object").class); ) {
    let s = l.getDeclaredFields();
    if (null !== s && 0 !== s.length) {
      l.equals(t.getClass()) || (0, e.xPrint)("Dump super class  " + l.getName() + " fields:");
      for (let l = 0; l < s.length; l++) {
        let r = s[l];
        r.setAccessible(!0);
        let n = r.getName(), i = r.get(t), o = r.getType();
        (0, e.xPrint)(o + " \t" + n + " => ", i + " => ", JSON.stringify(i));
      }
      l = l.getSuperclass();
    } else l = l.getSuperclass();
  }
}

function d(e) {
  let t = 0, l = e.length;
  if (l % 2 != 0) return null;
  l /= 2;
  let s = new Object;
  for (let r = 0; r < l; r++) {
    let l = e.substr(t, 2), n = parseInt(l, 16);
    n > 127 && (n = n - 255 - 1), s[r] = n, t += 2;
  }
  return s.length = l, s;
}

exports.printAllDeclaredMethodsInStr = t, exports.printAllDeclaredMethods = l, exports.getDeclaredMethod = s, 
exports.printAllDeclaredConstructors = r, exports.getDeclaredConstructor = n, exports.setFiled = i, 
exports.setFatherFiled = o, exports.setIntFiled = c, exports.setLongFiled = a, exports.getFiledObj = u, 
exports.printAllFileds = g, exports.str2BytesObj = d;

},{"./XPrint":87}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.hookAllMethod = void 0;

const t = require("./ReflectTool"), e = require("./XPrint");

function n(n, o) {
  let r = Java.use(n), a = r[o].overloads.length;
  for (var i = 0; i < a; i++) r[o].overloads[i].implementation = function() {
    let n = "";
    for (var r = 0; r < 100; r++) n = n.concat("==");
    (0, e.xPrint)(n), n = "", n = n.concat("\n*** entered init"), n = n.concat("\r\n");
    for (var a = 0; a < arguments.length; a++) n = n.concat("arg[" + a + "]: " + arguments[a] + " => " + JSON.stringify(arguments[a])), 
    n = n.concat("\r\n");
    n = n.concat(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new())), 
    (0, e.xPrint)(n), n = "";
    let i = this[o].apply(this, arguments);
    return n = n.concat("\nretval: " + i + " => " + JSON.stringify(i)), n = n.concat("\n*** exiting init"), 
    (0, t.printAllFileds)(this), (0, e.xPrint)(n), i;
  };
}

exports.hookAllMethod = n;

},{"./ReflectTool":85,"./XPrint":87}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.getNowDate = exports.xError = exports.xWarning = exports.xInfo = exports.xDebug = exports.xPrint = exports.initLog = exports.printBreak = exports.showAllMethod = exports.dumpMapField = exports.printMap = exports.getNativeStack = exports.printNativeStack = exports.printJavaStack = exports.bytesToString = exports.getDump = exports.printDump = void 0;

const t = require("./ReflectTool");

let e = !0, r = null;

const n = 4e3;

function o(t, e) {
  h("[function] xPrint[*] " + t.toString() + "  length: " + e.toString() + "\n[data]"), 
  h(hexdump(t, {
    offset: 0,
    length: e,
    header: !1,
    ansi: !1
  })), h("");
}

function a(t, e) {
  let r = "";
  return r += "[function] xPrint[*] " + t.toString() + "  length: " + e.toString() + "\n[data]\n", 
  r += hexdump(t, {
    offset: 0,
    length: e,
    header: !1,
    ansi: !1
  }) + "\n", r += "\n", r;
}

exports.printDump = o, exports.getDump = a;

var s = Java.use("com.android.okhttp.okio.ByteString");

function i(t) {
  return s.of(t).hex();
}

function c() {
  h(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
}

function l(t) {
  h("instr called from:\n" + Thread.backtrace(t.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n") + "\n");
}

function p(t) {
  return "instr called from:\n" + Thread.backtrace(t.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n") + "\n";
}

function g(t) {
  let e = t.keySet().iterator();
  for (;e.hasNext(); ) {
    let r = e.next().toString();
    h(r, t.get(r).toString());
  }
}

function u(e) {
  for (var r = Java.use("java.lang.reflect.Array"), n = r.getLength(e), o = 0; o < n; o++) {
    var a = r.get(e, o);
    h(a), h("*********************************************"), (0, t.printAllFileds)(a);
  }
}

function x(t) {
  for (var e in t) h(e);
}

function f(t) {
  h("*******************" + t + "************************");
}

function d(t) {
  e = t;
}

function h(...t) {
  if (e) console.log(m() + " [*]FUCK->", ...t); else {
    let e = "";
    for (let r = 0; r < t.length; r++) e += " " + t[r];
    r || (r = Java.use("android.util.Log"));
    let o = 0;
    for (;o * n < e.length; ) r.e(m() + " [*]FUCK->", e.substring(o * n, (o + 1) * n)), 
    o++;
  }
}

function b(...t) {
  F(D, t);
}

function k(...t) {
  F(w, t);
}

function S(...t) {
  F(A, t);
}

function v(...t) {
  F(C, t);
}

function m() {
  const t = new Date;
  let e = t.getMonth() + 1, r = t.getDate();
  return e <= 9 && (e = "0" + e), r <= 9 && (r = "0" + r), t.getFullYear() + "-" + e + "-" + r + " " + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
}

exports.bytesToString = i, exports.printJavaStack = c, exports.printNativeStack = l, 
exports.getNativeStack = p, exports.printMap = g, exports.dumpMapField = u, exports.showAllMethod = x, 
exports.printBreak = f, exports.initLog = d, exports.xPrint = h, exports.xDebug = b, 
exports.xInfo = k, exports.xWarning = S, exports.xError = v, exports.getNowDate = m;

let D = 0, w = 1, A = 2, C = 3;

function F(t, ...o) {
  if (e) switch (t) {
   case D:
    console.log(m() + " [*]xDebug->", ...o);
    break;

   case w:
    console.log(m() + " [*]xInfo->", ...o);
    break;

   case A:
    console.log(m() + " [*]xWarning->", ...o);
    break;

   case C:
    console.log(m() + " [*]xError->", ...o);
  } else {
    let e = "";
    for (let t = 0; t < o.length; t++) e += " " + o[t];
    r || (r = Java.use("android.util.Log"));
    let a = 0;
    for (;a * n < e.length; ) {
      switch (t) {
       case D:
        r.d(m() + " [*]FUCK->", e.substring(a * n, (a + 1) * n));
        break;

       case w:
        r.i(m() + " [*]FUCK->", e.substring(a * n, (a + 1) * n));
        break;

       case A:
        r.w(m() + " [*]FUCK->", e.substring(a * n, (a + 1) * n));
        break;

       case C:
        r.e(m() + " [*]FUCK->", e.substring(a * n, (a + 1) * n));
      }
      a++;
    }
  }
}

},{"./ReflectTool":85}],88:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.newClass = void 0;

const e = require("./XPrint");

class s {
  static classnameIndex=1;
  static createRunnableClass(s) {
    const t = Java.use("java.lang.Runnable");
    return Java.registerClass({
      name: this.getNextClassName(),
      implements: [ t ],
      methods: {
        run: function() {
          try {
            s();
          } catch (s) {
            (0, e.xPrint)("[Error] new runnable:", s);
          }
        }
      }
    });
  }
  static getNextClassName() {
    const e = "com.tencent.new.class$" + this.classnameIndex;
    return this.classnameIndex++, e;
  }
}

exports.newClass = s;

},{"./XPrint":87}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZ2VudC9pbmRleC50cyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL2FwcC9BY3Rpdml0eU1hbmFnZXIvSG9va0dldE1lbW9yeUluZm8uanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9hcHAvQXBwbGljYXRpb25QYWNrYWdlTWFuYWdlci9Ib29rR2V0SW5zdGFsbGVkQXBwbGljYXRpb25zLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvYXBwL0FwcGxpY2F0aW9uUGFja2FnZU1hbmFnZXIvSG9va0dldEluc3RhbGxlZFBhY2thZ2VzLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvYXBwL0FwcGxpY2F0aW9uUGFja2FnZU1hbmFnZXIvSG9va0dldEluc3RhbGxlclBhY2thZ2VOYW1lLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvYXBwL0FwcGxpY2F0aW9uUGFja2FnZU1hbmFnZXIvSG9va0dldFBhY2thZ2VJbmZvLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvYXBwL0FwcGxpY2F0aW9uUGFja2FnZU1hbmFnZXIvSG9va1F1ZXJ5SW50ZW50QWN0aXZpdGllcy5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL2FwcC9Db250ZXh0SW1wbC9BcHBsaWNhdGlvbkNvbnRlbnRSZXNvbHZlci9Ib29rUXVlcnkuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9hcHAvSUFjdGl2aXR5VGFza01hbmFnZXIvSG9va0dldFRvcFZpc2libGVBY3Rpdml0eS5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL2FwcC9LZXlndWFyZE1hbmFnZXIvSG9va0lzS2V5Z3VhcmRTZWN1cmUuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9hcHAvV2FsbHBhcGVyTWFuYWdlci9Ib29rR2V0RHJhd2FibGUuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9hcHAvdXNhZ2UvU3RvcmFnZVN0YXRzL0hvb2tHZXRBcHBCeXRlcy5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL2JsdWV0b290aC9CbHVldG9vdGhBZGFwdGVyL0hvb2tCbHVlVG9vdGhOYW1lLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvY29udGVudC9JbnRlbnQvSG9va1ByZXBhcmVUb0VudGVyUHJvY2Vzcy5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL2NvbnRlbnQvcG0vQ2hhbmdlZFBhY2thZ2VzL0hvb2tHZXRQYWNrYWdlTmFtZXMuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9oYXJkd2FyZS9TeXN0ZW1TZW5zb3JNYW5hZ2VyL1NlbnNvckV2ZW50UXVldWUvSG9va0Rpc3BhdGNoU2Vuc29yRXZlbnQuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9sb2NhdGlvbi9Mb2NhdGlvbi9Ib29rR2V0TGF0aXR1ZGUuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9sb2NhdGlvbi9Mb2NhdGlvbi9Ib29rR2V0TG9uZ2l0dWRlLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvbG9jYXRpb24vTG9jYXRpb24vSG9va1NldExhdGl0dWRlLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvbG9jYXRpb24vTG9jYXRpb24vSG9va1NldExvbmdpdHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL2xvY2F0aW9uL0xvY2F0aW9uL1JhbmRvbUxvY2F0aW9uRmxvYXQuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9tZWRpYS9BdWRpb01hbmFnZXIvSG9va0dldE1vZGUuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9tZWRpYS9BdWRpb01hbmFnZXIvSG9va0dldFN0cmVhbVZvbHVtZS5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL25ldC9Db25uZWN0aXZpdHlNYW5hZ2VyL0hvb2tHZXREZWZhdWx0UHJveHkuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9uZXQvTGlua1Byb3BlcnRpZXMvSG9va0dldEh0dHBQcm94eS5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL25ldC9OZXR3b3JrQ2FwYWJpbGl0aWVzL0hvb2tIYXNUcmFuc3BvcnQuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9uZXQvUHJveHkvSG9va0dldERlZmF1bHRIb3N0LmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvbmV0L1Byb3h5L0hvb2tHZXREZWZhdWx0UG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL25ldC93aWZpL1dpZmlNYW5hZ2VyL0hvb2tHZXRDb25maWd1cmVkTmV0d29ya3MuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9uZXQvd2lmaS9XaWZpTWFuYWdlci9Ib29rR2V0Q29ubmVjdGlvbkluZm8uanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9uZXQvd2lmaS9XaWZpTWFuYWdlci9Ib29rR2V0U2NhblJlc3VsdHMuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9vcy9CdWlsZC9Ib29rQnVpbGRGaWVsZC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL29zL0J1aWxkL0hvb2tCdWlsZFZlcnNpb25GaWVsZC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL29zL1N0YXRGcy9Ib29rR2V0QXZhaWxhYmxlQmxvY2tzLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvb3MvU3RhdEZzL0hvb2tHZXRCbG9ja1NpemUuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9vcy9TeXN0ZW1Qcm9wZXJ0aWVzL0hvb2tOYXRpdmVHZXQuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9vcy9TeXN0ZW1Qcm9wZXJ0aWVzL0hvb2tTeXN0ZW1Qcm9wR2V0LmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvcHJvdmlkZXIvU2V0dGluZ3MvR2xvYmFsL0hvb2tHbG9iYWxHZXRJbnQuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9wcm92aWRlci9TZXR0aW5ncy9HbG9iYWwvSG9va0dsb2JhbEdldFN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3Byb3ZpZGVyL1NldHRpbmdzL1NlY3VyZS9Ib29rU2VjdXJlR2V0SW50LmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvcHJvdmlkZXIvU2V0dGluZ3MvU2VjdXJlL0hvb2tTZWN1cmVHZXRTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC9wcm92aWRlci9TZXR0aW5ncy9TeXN0ZW0vSG9va1N5c3RlbUdldEludC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3Byb3ZpZGVyL1NldHRpbmdzL1N5c3RlbS9Ib29rU3lzdGVtR2V0U3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvSG9va0dldEFsbENlbGxJbmZvLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvSG9va0dldENlbGxMb2NhdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tHZXRDdXJyZW50UGhvbmVUeXBlRm9yU2xvdC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tHZXREZXZpY2VJZC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tHZXRJbWVpLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvSG9va0dldExpbmUxTnVtYmVyLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvSG9va0dldE5ldHdvcmtPcGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tHZXROZXR3b3JrU3BlY2lmaWVyLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvSG9va0dldE5ldHdvcmtUeXBlLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvSG9va0dldFBob25lVHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tHZXRTaWduYWxTdHJlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tHZXRTaW1DYXJyaWVySWQuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC90ZWxlcGhvbnkvVGVsZXBob255TWFuYWdlci9Ib29rR2V0U2ltQ291bnRyeUlzby5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tHZXRTaW1PcGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tHZXRTaW1PcGVyYXRvck5hbWUuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvYW5kcm9pZC90ZWxlcGhvbnkvVGVsZXBob255TWFuYWdlci9Ib29rR2V0U2ltU2VyaWFsTnVtYmVyLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvSG9va0dldFNpbVN0YXRlLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvSG9va0dldFN1YnNjcmliZXJJZC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9hbmRyb2lkL3RlbGVwaG9ueS9UZWxlcGhvbnlNYW5hZ2VyL0hvb2tIYXNJY2NDYXJkLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2FuZHJvaWQvdGVsZXBob255L1RlbGVwaG9ueU1hbmFnZXIvUHJpbnRMb2cuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvY29tL2FuZHJvaWQvaWQvaW1wbC9JZFByb3ZpZGVySW1wbC9Ib29rR2V0T0FJRC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9qYXZhL2lvL0ZpbGUvSG9va0xhc3RNb2RpZmllZC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rSmF2YS9qYXZhL2xhbmcvUnVudGltZS9Ib29rUnVudGltZUV4ZWMuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvamF2YS9sYW5nL1N5c3RlbS9Ib29rR2V0UHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va0phdmEvamF2YS9uZXQvTmV0d29ya0ludGVyZmFjZS9Ib29rR2V0SGFyZHdhcmVBZGRyZXNzLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tKYXZhL2phdmEvbmV0L05ldHdvcmtJbnRlcmZhY2UvSG9va0dldE5ldHdvcmtJbnRlcmZhY2VzLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tOYXRpdmUvbGliYy9Ib29rQWNjZXNzLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tOYXRpdmUvbGliYy9Ib29rT3Blbi5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC9Ib29rTmF0aXZlL2xpYmMvSG9va1BvcGVuLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tOYXRpdmUvbGliYy9Ib29rUmVhZGxpbmsuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va05hdGl2ZS9saWJjL0hvb2tTdGF0LmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tOYXRpdmUvbGliYy9Ib29rU3lzdGVtLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L0hvb2tOYXRpdmUvbGliYy9Ib29rU3lzdGVtUHJvcGVydHlHZXQuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvSG9va05hdGl2ZS9saW5rZXIvSG9va0luaXQuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvdXRpbHMvQWN0aXZpdHlVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L3V0aWxzL0FwcFRvb2wuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvdXRpbHMvSG9va0hlbHBlci5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC91dGlscy9IdHRwVXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC91dGlscy9Mb2FkZXJVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L3V0aWxzL1JhbmRvbVV0aWwuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvdXRpbHMvUmVmbGVjdFRvb2wuanMiLCJub2RlX21vZHVsZXMvaGFydmVzdGVyL2Rpc3QvdXRpbHMvVHJhY2VVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2hhcnZlc3Rlci9kaXN0L3V0aWxzL1hQcmludC5qcyIsIm5vZGVfbW9kdWxlcy9oYXJ2ZXN0ZXIvZGlzdC91dGlscy9uZXdDbGFzcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLE1BQUEsSUFBQSxRQUFBOztDQUVBLEdBQUEsRUFBQSxPQUFNOzs7QUNGTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcjVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIifQ==
