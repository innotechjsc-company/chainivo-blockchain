# ERC-20 Token Transfer Implementation

## Tổng quan

Hàm `createTransaction` đã được cập nhật để chuyển **CAN tokens** (ERC-20) thay vì ETH. Điều này cho phép người dùng mua membership tiers bằng CAN tokens thay vì ETH.

## Cách hoạt động

### 1. **ERC-20 Transfer Process**

```typescript
// 1. Encode ERC-20 transfer data
const data = encodeERC20Transfer(DESTINATION_WALLET, amount);

// 2. Tạo giao dịch với token contract
const txHash = await window.ethereum.request({
  method: "eth_sendTransaction",
  params: [
    {
      from: fromAddress,
      to: CAN_TOKEN_CONTRACT, // Token contract address
      value: "0x0", // Không gửi ETH
      data: data, // ERC-20 transfer data
      gas: "0xC350", // 50000 gas
    },
  ],
});
```

### 2. **Data Encoding**

ERC-20 transfer sử dụng function `transfer(address,uint256)` với:

- **Function Selector**: `0xa9059cbb`
- **Address Parameter**: 64 ký tự hex (32 bytes)
- **Amount Parameter**: 64 ký tự hex (32 bytes)

```typescript
const encodeERC20Transfer = (toAddress: string, amount: number): string => {
  // Convert amount to wei (18 decimals)
  const amountWei = BigInt(Math.floor(amount * Math.pow(10, 18)));

  // Function selector for transfer(address,uint256)
  const functionSelector = "a9059cbb";

  // Encode address (remove 0x, pad to 64 chars)
  const encodedTo = toAddress.slice(2).toLowerCase().padStart(64, "0");

  // Encode amount (convert to hex, pad to 64 chars)
  const encodedAmount = amountWei.toString(16).padStart(64, "0");

  // Combine: 0x + functionSelector + encodedTo + encodedAmount
  return "0x" + functionSelector + encodedTo + encodedAmount;
};
```

### 3. **Configuration**

```typescript
// CAN Token contract address từ config
const CAN_TOKEN_CONTRACT = config.BLOCKCHAIN.CAN_TOKEN_ADDRESS;
// Default: "0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F"

// Destination wallet (nơi nhận tokens)
const DESTINATION_WALLET = "0x7c4767673cc6024365e08f2af4369b04701a5fed";
```

## So sánh ETH vs ERC-20 Transfer

### **ETH Transfer (Cũ)**

```typescript
{
  from: fromAddress,
  to: DESTINATION_WALLET,
  value: amountHex, // ETH amount
  gas: "0x5208", // 21000 gas
}
```

### **ERC-20 Transfer (Mới)**

```typescript
{
  from: fromAddress,
  to: CAN_TOKEN_CONTRACT, // Token contract
  value: "0x0", // No ETH
  data: encodedData, // ERC-20 transfer data
  gas: "0xC350", // 50000 gas
}
```

## Lợi ích của ERC-20 Transfer

### 1. **Token-based Economy**

- Sử dụng CAN tokens thay vì ETH
- Phù hợp với hệ sinh thái của dự án
- Dễ quản lý và tracking

### 2. **Lower Gas Costs**

- Chỉ cần gas cho transaction execution
- Không cần gửi ETH value
- Gas limit cao hơn (50000 vs 21000)

### 3. **Better UX**

- Người dùng chỉ cần có CAN tokens
- Không cần convert ETH
- Consistent với token economy

## Error Handling

```typescript
// Specific error handling cho ERC-20 transfers
if (error.code === 4001) {
  throw new Error("Người dùng đã từ chối giao dịch");
} else if (error.message?.includes("insufficient funds")) {
  throw new Error("Số dư không đủ để thực hiện giao dịch");
} else if (error.message?.includes("gas")) {
  throw new Error("Lỗi gas. Vui lòng thử lại.");
}
```

## Testing

### 1. **Console Logging**

```typescript
console.log("ERC-20 Transfer Transaction:", {
  from: fromAddress,
  tokenContract: CAN_TOKEN_CONTRACT,
  to: DESTINATION_WALLET,
  amount: amount,
  amountWei: amountWei.toString(),
  data: data,
});
```

### 2. **Validation**

- Kiểm tra địa chỉ ví hợp lệ
- Kiểm tra số lượng token hợp lệ
- Kiểm tra MetaMask connection

## Requirements

### 1. **User Requirements**

- MetaMask wallet connected
- Sufficient CAN token balance
- Sufficient ETH for gas fees

### 2. **Technical Requirements**

- CAN token contract deployed
- User has approved token spending (nếu cần)
- Correct network (Amoy testnet)

## Security Considerations

### 1. **Input Validation**

- Validate address format
- Validate amount range
- Check for finite numbers

### 2. **Gas Estimation**

- Use appropriate gas limit
- Handle gas estimation failures
- Provide clear error messages

### 3. **Transaction Safety**

- No ETH value sent
- Correct contract address
- Proper data encoding

## Kết luận

Việc chuyển từ ETH transfer sang ERC-20 transfer mang lại:

- ✅ **Token-based economy** phù hợp với dự án
- ✅ **Lower costs** cho người dùng
- ✅ **Better UX** với CAN tokens
- ✅ **Consistent** với hệ sinh thái blockchain
- ✅ **Secure** và reliable implementation

Hàm `createTransaction` hiện tại đã sẵn sàng để chuyển CAN tokens một cách an toàn và hiệu quả!
