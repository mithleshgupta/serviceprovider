import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Dimensions,
    Modal,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";

const { width, height } = Dimensions.get("window");

const OTP = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false); 
    const inputRefs = useRef([]);
    const { email, userType, action, phone, gender, dob, instagram, city } = route.params;

    const handleChange = (value, index) => {
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
                const updatedOtp = [...otp];
                updatedOtp[index - 1] = "";
                setOtp(updatedOtp);
            }
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true); 
        try {
            const endpoint =
                action === "signup"
                    ? 'http://65.0.167.149:8086/api/auth/verify-signup-otp'
                    : 'http://65.0.167.149:8086/api/auth/login-verify';

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: otp.join(""),
                    userType,
                    phone,
                    gender,
                    dob,
                    instagram,
                    city,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                await AsyncStorage.setItem("token", result.token);

                const decodedToken = jwtDecode(result.token);
                console.log("Decoded Token:", decodedToken);
                const userId = decodedToken.userId;

                checkUserVerification(userId);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            alert("Something went wrong.");
        } finally {
            setIsLoading(false); 
        }
    };

    const checkUserVerification = async (userId) => {
        try {
            const response = await fetch(`http://65.0.167.149:8086/api/auth/check-verification/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            if (response.ok) {
                if (result.is_verified) {
                    navigation.navigate("Registration");
                } else {
                    navigation.navigate("verification");
                }
            } else {
                alert("Failed to check verification status.");
            }
        } catch (error) {
            alert("Error checking verification.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.title}>OTP</Text>
            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={value}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                    />
                ))}
            </View>
            <Text style={styles.description}>
                Enter the four-digit code sent to your entered email address
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="fade"
                visible={isLoading}
                onRequestClose={() => {}}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color="#DE3B40" />
                        <Text style={styles.modalText}>Verifying OTP...</Text>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default OTP;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
        paddingHorizontal: width * 0.05,
    },
    title: {
        fontSize: width * 0.1,
        fontWeight: "bold",
        color: "#DE3B40",
        marginBottom: height * 0.1,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: height * 0.05,
    },
    otpInput: {
        width: width * 0.12,
        height: width * 0.12,
        borderWidth: 2,
        borderColor: "#DE3B40",
        borderRadius: 5,
        textAlign: "center",
        fontSize: width * 0.05,
        color: "#171A1F",
    },
    description: {
        fontSize: width * 0.035,
        color: "#DE3B40",
        textAlign: "center",
        marginTop: height * 0.02,
    },
    button: {
        marginTop: 50,
        width: "90%",
        height: height * 0.06,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DE3B40",
        borderRadius: 6,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: width * 0.045,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#FFF",
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        marginTop: 10,
        fontSize: width * 0.045,
        color: "#171A1F",
        textAlign: "center",
    },
});
