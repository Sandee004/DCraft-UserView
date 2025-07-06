import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";

export default function PaymentScreen() {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total: string }>(); // comes as string
  const [isVerifying, setIsVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("guest@example.com");

  const paystackPublicKey = "pk_test_801d9fcd35867aa5954878e6c700c0543a53c32b"; // Replace with your real one
  const BACKEND_URL = "https://dcraft-backend.onrender.com";

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (email) {
          setUserEmail(email);
        }
      } catch (error) {
        console.error("Error getting user email:", error);
      }
    };
    getUserEmail();
  }, []);

  const amountInKobo = Number(total) * 100;

  const handlePaymentResponse = async (data: any) => {
    const event = JSON.parse(data);

    if (event.event === "successful") {
      const reference = event.reference;
      setIsVerifying(true);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/verify_payment/${reference}`
        );
        const result = await response.json();

        if (result.status === "success") {
          Alert.alert(
            "✅ Payment Successful",
            "Thank you! Your order was confirmed."
          );
          router.replace("/cart"); // or wherever your cart screen is
        } else {
          Alert.alert(
            "❌ Verification Failed",
            "We couldn't confirm your payment."
          );
        }
      } catch {
        Alert.alert(
          "⚠️ Error",
          "Something went wrong while verifying the payment."
        );
      } finally {
        setIsVerifying(false);
      }
    } else if (event.event === "cancelled") {
      Alert.alert("Payment Cancelled", "You cancelled the transaction.");
      router.back();
    }
  };

  const paystackHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body onload="payWithPaystack()" style="display:flex;justify-content:center;align-items:center;height:100vh;">
        <p style="font-size:16px;color:#444;">Loading payment interface...</p>
        <script>
          function payWithPaystack(){
            var handler = PaystackPop.setup({
              key: '${paystackPublicKey}',
              email: '${userEmail}',
              amount: ${amountInKobo},
              currency: 'NGN',
              callback: function(response){
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  event: 'successful',
                  reference: response.reference
                }));
              },
              onClose: function(){
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'cancelled' }));
              }
            });
            handler.openIframe();
          }
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`px-4 py-3 border-b border-gray-200 flex-row items-center justify-between`}
      >
        <Text style={tw`text-lg font-bold text-black`}>Payment</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={tw`text-blue-700 text-base`}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {isVerifying ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#000080" />
          <Text style={tw`mt-4 text-base text-gray-700`}>
            Verifying your payment...
          </Text>
        </View>
      ) : (
        <WebView
          originWhitelist={["*"]}
          source={{ html: paystackHtml }}
          onMessage={(event) => handlePaymentResponse(event.nativeEvent.data)}
          startInLoadingState
          renderLoading={() => (
            <View style={tw`flex-1 justify-center items-center`}>
              <ActivityIndicator size="large" color="#000080" />
              <Text style={tw`mt-4 text-base text-gray-600`}>
                Preparing secure payment...
              </Text>
            </View>
          )}
          style={tw`flex-1`}
        />
      )}
    </SafeAreaView>
  );
}
