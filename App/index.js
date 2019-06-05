import React from "react";
import {StyleSheet, View, StatusBar, TouchableOpacity, Text, Dimensions, Picker, Platform} from "react-native";

const screen = Dimensions.get("window");

const createArray = length => {
    const arr = [];
    let i = 0;
    while (i < length) {
        arr.push(i.toString());
        i += 1;
    }
    return arr;
};

const ADJUSTABLE_DECIMALS = createArray(11);

export default class App extends React.Component {
    state = {
        timerOn: false,
        timerStart: 0,
        timerTime: 0,
        decimals: 0
    };

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    startTimer = () => {
        this.setState({
            timerOn: true,
            timerTime: this.state.timerTime,
            timerStart: new Date() - this.state.timerTime
        });

        this.timer = setInterval(() => {
            this.setState({
                timerTime: new Date() - this.state.timerStart
            });
        }, 10);
    };

    stopTimer = () => {
        this.setState({timerOn: false});
        clearInterval(this.timer);
    };

    resetTimer = () => {
        this.setState({
            timerOn: false,
            timerStart: 0,
            timerTime: 0
        });
        clearInterval(this.timer);
    };

    convertMilliseconds(value) {
        const {decimals} = this.state;
        const minutes = ("0" + (Math.floor(value / 60000) % 60)).slice(-2);
        const seconds = ((value % 60000) / 1000).toFixed(decimals);
        return (seconds === 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    }

    render() {
        const {timerTime, timerOn} = this.state;
        const parsedTimer = this.convertMilliseconds(timerTime);

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <Text style={styles.timerText}>{parsedTimer}</Text>
                <View style={styles.actionWrapper}>
                    {!timerOn
                        ?
                        <TouchableOpacity onPress={this.startTimer} style={styles.button}>
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={this.stopTimer} style={[styles.button, styles.buttonStop]}>
                            <Text style={[styles.buttonText, styles.buttonStopText]}>Stop</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={this.resetTimer} style={[styles.button, styles.buttonReset]}>
                        <Text style={[styles.buttonText, styles.buttonResetText]}>Reset</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Select the amount of decimals to show:</Text>
                    <Picker
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                        selectedValue={this.state.decimals}
                        onValueChange={itemValue => {
                            this.setState({decimals: itemValue});
                        }}
                        mode="dropdown"
                    >
                        {ADJUSTABLE_DECIMALS.map(value => (<Picker.Item key={value} label={value} value={value}/>))}
                    </Picker>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#07121b",
        alignItems: "center",
        justifyContent: "center",
    },
    actionWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        borderWidth: 5,
        borderColor: "#53d769",
        width: screen.width / 3,
        height: screen.width / 3,
        borderRadius: screen.width / 3,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        marginRight: 10,
        marginLeft: 10,
    },
    buttonStop: {
        borderColor: "#fc3d39",
    },
    buttonText: {
        fontSize: 30,
        color: "#53d769",
    },
    buttonStopText: {
        color: "#fc3d39",
    },
    timerText: {
        color: "#fff",
        fontSize: 30,
    },
    buttonReset: {
        borderColor: '#8e8e93',
    },
    buttonResetText: {
        color: '#8e8e93',
    },
    pickerLabel: {
        marginTop: 20,
        marginBottom: 20,
        color: "#fff",
        fontSize: 15,
    },
    picker: {
        width: 50,
        ...Platform.select({
            android: {
                color: '#fff',
                backgroundColor: '#07121B',
                marginLeft: 10
            }
        })
    },
    pickerItem: {
        color: "#fff",
        fontSize: 20,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    }
});

