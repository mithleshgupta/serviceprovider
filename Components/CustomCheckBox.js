import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const CustomCheckbox = ({ label }) => {
    const [checked, setChecked] = useState(false);

    return (
        <View style={styles.checkboxContainer}>
            <TouchableOpacity
                style={[
                    styles.outerSquare,
                    { backgroundColor: checked ? "#FFFFFFFF" : "transparent" },
                ]}
                onPress={() => setChecked(!checked)}
                activeOpacity={0.7}
            >
                {checked && (
                    <Svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <Path
                            d="M20 6L9 17L4 12"
                            stroke="#EB6769FF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                )}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>{label}</Text>
        </View>
    );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    outerSquare: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: "#DE3B40",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    checkboxLabel: {
        fontFamily: "Mulish",
        fontSize: 14,
        lineHeight: 22,
        fontWeight: "400",
        color: "#DE3B40",
    },
});
