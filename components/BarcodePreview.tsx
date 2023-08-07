import { View, Text, Button } from "react-native";

const BarcodePreview = ({navigation, route, barcode, onSelect}) => {
    return(
        <View>
            <Text>Preview: {barcode} </Text>

            <Button title="OK" onPress={() => {
                onSelect('EAN')
            }} 
      />
        </View>
    );
}




export default BarcodePreview

