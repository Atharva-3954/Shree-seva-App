-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

