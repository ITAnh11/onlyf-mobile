import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import PaymentApi from '../../networking/payment.api'; 

export default function UpgradeScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade to Premium</Text>

      <View style={styles.planCard}>
        <Text style={styles.planTitle}>1 Month Plan</Text>
        <Text style={styles.planPrice}>$9.99/month</Text>
        <Text style={styles.planDescription}>Enjoy premium features for one month.</Text>
        <TouchableOpacity
          style={[
            styles.selectButton,
            selectedPlan === '1month' && styles.selectedButton,
          ]}
          onPress={() => setSelectedPlan('1month')}
        >
          <Text style={styles.buttonText}>Choose 1 Month</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.planCard}>
        <Text style={styles.planTitle}>1 Year Plan</Text>
        <Text style={styles.planPrice}>$99.99/year</Text>
        <Text style={styles.planDescription}>Enjoy premium features for one year</Text>
        <TouchableOpacity
          style={[
            styles.selectButton,
            selectedPlan === '1year' && styles.selectedButton,
          ]}
          onPress={() => setSelectedPlan('1year')}
        >
          <Text style={styles.buttonText}>Choose 1 Year</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={async () => {
            if (selectedPlan) {
            try {
                const type = selectedPlan === '1month' ? 'month' : 'year';
                const res = await PaymentApi.getPaymentLink(type); // Gọi API để lấy link thanh toán
                console.log('Link thanh toán:', res);

                if (res?.url) {
                Linking.openURL(res.url); // mở link thanh toán
                } else {
                alert('Không thể tạo link thanh toán.');
                }
            } catch (err) {
                console.error('Lỗi thanh toán:', err);
                alert('Đã xảy ra lỗi khi tạo link thanh toán.');
            }
            }
        }}
        >
        <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  planTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  planPrice: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  planDescription: {
    color: '#aaa',
    fontSize: 14,
    marginVertical: 8,
  },
  selectButton: {
    backgroundColor: '#FFD43B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  selectedButton: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  paymentButton: {
    backgroundColor: '#FFD43B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
});
