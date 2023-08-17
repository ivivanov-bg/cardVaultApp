import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type Scanned = {format: any, data: string}
export type ScanScreenProps = { onScanned: ({format, data}: Scanned) => void }

export type ScanNav = NativeStackScreenProps<{
    Scan: ScanScreenProps
}, 'Scan'>


const Scanner = ({
    navigation, 
    route,
}: ScanNav) => {
const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  
    const BarcodeMap = {
      256: 'QR',
      32: 'EAN13',
      128: 'ITF',
      1: 'CODE128',
  }

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    var format = BarcodeMap[type] ?? type
    route.params.onScanned({format, data})
    navigation.goBack()
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default Scanner
