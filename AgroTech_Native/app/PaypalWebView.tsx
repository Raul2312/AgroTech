
import { ThemedText } from '@/components/themed-text';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface PayPalWebViewProps {
  amount?: string;
  currency?: string;
}

export default function PayPalWebView({ amount = "10.00", currency = "MXN" }: PayPalWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("Initializing...");


  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'webview_log') {
        const logMsg = `[WebView ${data.logType}] ${JSON.stringify(data.data)}`;
        console.log(logMsg); // Mirror to terminal
        setLogs(prev => [logMsg, ...prev].slice(0, 50));
        return;
      }

      if (data.type === 'payment_success') {
        const name = data.details.payer.name.given_name;
        setStatus(`Success! Paid by ${name}`);
        alert(`Transaction completed by ${name}`);
      } else if (data.type === 'payment_cancel') {
        setStatus('Payment Cancelled');
        alert('Transaction cancelled');
      } else if (data.type === 'payment_error') {
        setStatus(`Error: ${data.error}`);
        alert('An error occurred with PayPal: ' + data.error);
      }
    } catch (e: any) {
      console.error("Error parsing message from WebView", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Status: {status}</ThemedText>
      </View>
      
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: `https://api.agrootech.com.mx/payment/${amount}` }}
          onMessage={onMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          originWhitelist={['*']}
          mixedContentMode="always"
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          renderLoading={() => (
            <ActivityIndicator 
              color="#0000ff" 
              size="large" 
              style={styles.loading} 
            />
          )}
          style={styles.webview}
        />
      </View>

      <View style={styles.logContainer}>
        <ThemedText type="defaultSemiBold">WebView Logs:</ThemedText>
        <ScrollView style={styles.logScroll}>
          {logs.map((log, index) => (
            <ThemedText key={index} style={styles.logText}>{log}</ThemedText>
          ))}
          {logs.length === 0 && <ThemedText style={styles.logText}>No logs yet...</ThemedText>}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: 600,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  webviewContainer: {
    height: 350,
    width: '100%',
  },
  webview: {
    flex: 1,
  },
  logContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  logScroll: {
    flex: 1,
    marginTop: 5,
  },
  logText: {
    fontSize: 10,
    fontFamily: 'Courier',
    marginBottom: 2,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -18,
  }
});

