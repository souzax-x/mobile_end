import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateInputs = () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Erro', 'Usuário e senha são obrigatórios.');
            return false;
        }
        return true;
    };

    const loginWithAPI = async () => {
        if (!validateInputs()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://192.168.1.236:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                navigation.navigate('MainScreen');
            } else {
                Alert.alert('Erro', data.message || 'Falha ao realizar login. Verifique suas credenciais.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithBiometrics = async () => {
        const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (hasBiometrics && supportedTypes.length > 0) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Autentique-se para continuar',
            });

            if (result.success) {
                navigation.navigate('MainScreen');
            } else {
                Alert.alert('Erro', 'Falha na autenticação biométrica.');
            }
        } else {
            Alert.alert('Erro', 'Recurso de biometria não disponível.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
            <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#ddd"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#ddd"
            />
            <TouchableOpacity style={styles.button} onPress={loginWithAPI} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.biometricsButton} onPress={loginWithBiometrics}>
                <Text style={styles.biometricsText}>Usar Senha do celular</Text>
            </TouchableOpacity>
        </View>
    );
}

function MainScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Você está na tela principal</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="MainScreen" component={MainScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#222',
        color: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#555',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#e60000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    biometricsButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    biometricsText: {
        color: '#FF5733',
        fontSize: 16,
    },
});
