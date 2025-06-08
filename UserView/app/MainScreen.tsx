import { View, SafeAreaView } from "react-native";
import tw from "twrnc";

export default function MainScreen() {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        <p>Hii</p>
      </View>
    </SafeAreaView>
  );
}
