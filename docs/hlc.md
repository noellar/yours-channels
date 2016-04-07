#Hash Locked Contracts (HLCs).

Below is an simple explanation of hash locked contracts. These are a simplified version of hash time locked contracts (HTLC). As far as I can tell they already guaranty that payments will be made to the right people eventually, but I'm not sure if there is room for timing attacks where a party withholds a pyment for extended amount of time.

An advantage of HLCs as opposed to HTLCs is that they do not require the receiver of a payment to be online when a payment is made.

We are assuming that all actors are malicious, but not idiots; that is they act in their own best interest and try to scam everybody else whenever possible. However we assume that the payer actually want's to pay the payee.

### An Example

Lets say that Alice owes Dave 0.1. She wants to pay through a lighting network, but does not have a payment channel open to him. However, she can route through Carol and Bob:

    Alice -> Bob -> Carol -> Dave

**Step 1)** Dave generates a secret. Alice and Dave agree to use the secret as a payment confirmation token, that is if Alice can present the secret then they will consider the payment to be made.

Alice is happy with this arrangement, all she'll need is knowledge of the secret and her debt will be considered payed. Dave has no reason to worry either: he is never forced to reveal the secret, and will only do so if he get's 0.1 in return.


**Step 2)** As Alice has no channel open to Dave, she turns to Bob who is "closer" to Dave in the network. She proposes the following: "Yo Bob, if you can send me Dave's secret, then I will send you 0.100002".

That's not an irrational thing for Alice to do given that Dave will accept the fact that Alice knows the secret as a proof that she has re-payed her debt. Bob is not at risk, bc he has not made a promise to pay anybody.


**Step 3)** Bob is now motivated to see if he can get ahold of Dave's secret. So he turns to Carol, bc he knows that Carol has a direct channel with Dave. He says: "Carol, if you can send me Dave's secret then I will send you 0.100001".

There is no risk involved for Bob at all: If Caro accepts and gives him s, he'll pay her the 0.100001, but he can use s to get a refund of 0.100002 from Alice which will still leave him with a profit. Again, Carrol has not made any commitment at this point.


**Step 4)** Next Carol tries to get ahold of Dave. However, Dave is not online. Carol leaves him messages: "Hey Dave, we should get together again. Btw I heard you know a secret, wanna let me know? I'll give you 0.1".

When Dave gets back online he finds Carol's message, Dave has a bit of a decision to make: He has three choices:

1. Give s to Carol, and get 0.1 form her. Since he shares the secret with somebody and information wants to be free, Dave is aware of the possibility that Alice will end up knowing his secret. However Dave does not need to worry about that, bc he gets his money (and Alice can prove that she payed). 
  
  However, Dave is not certain that Alice will end up knowing the secret. That case is even better for Dave, bc he get's money from Carol and can still claim that Alice owes him money (that's bc Alice cannot prove the payment by presenting s).

2. Dave's second option is to give the secret to someone other than Carol. This is a very bad move for Dave. He is not sure to get money from Carol. Plus, as he has shared the secret, he cannot control if Alice will end up knowing the secret (in fact that's a very likely outcome as Alice is willing to pay money to get ahold of the secret). Dave would be very stupid opt for this decision..
  
3. Finally, Dave could not give the secret to anybody. In this case all the above contracts are "in the air", nobody pays money to anybody bc nobody other than Dave knows s. Nothing bad happens in this case other than that Dave does not get any money. Not an awesome move for him, but well.

Note that only in case where Dave is sure to get his money is (a). As we assumed that Dave is not an idiot, he will opt for (a) as soon as he finds Carols message.

What if Dave never comes back: nobody pays, nobody looses money, Dave never get's payed and Alice can keep her money... (same as option c)

So Dave gives the secret to Carol and gets 0.1. At this point Carol goes through the same thinking as Dave and will end up giving the secret to Bob and get 0.10001 in return. Same thing for Bob, who finally gives the secret to Alice.

**Let's see who has what now:**

* Alice has payed 0.10002, 0.1 to Dave and 0.00002 in network fees. But she knows the secret so she can prove she has re-payed her debt.
* Bob made a profit of 0.00001
* Carol made a profit of 0.00001
* Dave got a payment of 0.1 and must assume that Alice ended up knowing the secret

Everybody should be happy..