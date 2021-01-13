import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import html from './web/index';
let baseUrl = 'file:///android_asset/';
if (Platform.OS === 'ios') {
  baseUrl = null;
}
const js = options => {
  let string = `
    setTimeout(() => {


    var joystick = nipplejs.create({
      zone: document.getElementById('zone_joystick'),
      color: "${options.color}",
      lockX: ${options.lockX},
      lockY: ${options.lockY},
      mode: '${options.mode}',
      size: ${options.size},
      position: {
        left: "${options.position.left}",
        top: "${options.position.top}"
      }
    });

    joystick.on('start', function(evt, data) {
      let dataToReturn = { type: "onStart", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('end', function(evt, data) {
      let dataToReturn = { type: "onEnd", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })


    joystick.on('move', function(evt, data) {
      let dataToReturn = { type: "onMove", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })


    joystick.on('dir', function(evt, data) {
      let dataToReturn = { type: "onDir", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })


    joystick.on('dir:up', function(evt, data) {
      let dataToReturn = { type: "onDirUp", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('dir:down', function(evt, data) {
      let dataToReturn = { type: "onDirDown", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('dir:left', function(evt, data) {
      let dataToReturn = { type: "onDirLeft", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('dir:right', function(evt, data) {
      let dataToReturn = { type: "onDirRight", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('plain', function(evt, data) {
      let dataToReturn = { type: "onPlane", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('plain:up', function(evt, data) {
      let dataToReturn = { type: "onPlaneUp", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('plain:down', function(evt, data) {
      let dataToReturn = { type: "onPlaneDown", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('plain:left', function(evt, data) {
      let dataToReturn = { type: "onPlaneLeft", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })

    joystick.on('plain:right', function(evt, data) {
      let dataToReturn = { type: "onPlaneRight", event: evt.type, data }
      window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
    })
    }, 500)
  `;

  return string;
};

export class RNGamePadSingle extends React.Component {
  constructor() {
    super();
  }

  invokeCallback(json) {
    let { type, event, data } = JSON.parse(json);
    if (this.props[type]) {
      this.props[type](event, data);
    }
  }

  render() {
    let {
      color = "green",
      size = 200,
      lockX = false,
      lockY = false
    } = this.props.options;
    let {
      onButtonBPress,
      buttonAColor,
      onButtonAPress,
      buttonBColor
    } = this.props;

    var options = {
      color: color,
      mode: "static",
      size,
      position: {
        left: "50%",
        top: "50%"
      },
      lockX,
      lockY
    };
    return (
      <View style={{ flex: 1, flexDirection: "row", zIndex: -1, backgroundColor: 'transparent', marginTop: 200 }}>
        <View style={{ flex: 1, zIndex: -1, backgroundColor: 'transparent', marginRight: 100 }}>
          <WebView
            source={{ html, baseUrl }}
            onMessage={evt => this.invokeCallback(evt.nativeEvent.data)}
            injectedJavaScript={js(options)}
            style={{ backgroundColor: 'transparent' }}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: 'transparent', zIndex: -1, marginLeft: 100, }}>
          <View
            style={{
              height: "100%",
              zIndex: -1,
              marginLeft: 100,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 50,
                zIndex: -1
              }}
            >
              <TouchableOpacity
                style={[styles.button, { backgroundColor: `${buttonAColor}` }]}
                onPress={() => onButtonAPress()}
              >
                <Text style={styles.buttonText}>A</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 50
              }}
            >
              <TouchableOpacity
                style={[styles.button, { backgroundColor: `${buttonBColor}` }]}
                onPress={() => onButtonBPress()}
              >
                <Text style={styles.buttonText}>B</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 90 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 22,
    color: "white",
    fontWeight: "700"
  }
});
