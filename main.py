balance = 5000
pin = input("Enter PIN: ")

if pin == "1234":
    amount = int(input("Enter amount: "))
    
    if amount <= balance:
        print("Withdrawal successful 💸")
    else:
        print("Insufficient balance ❌")
else:
    print("Wrong PIN 🔒")