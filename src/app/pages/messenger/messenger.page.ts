import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firebaseConfig } from 'src/environments/environment';

@Component({
  selector: 'app-messenger',
  templateUrl: 'messenger.page.html',
  styleUrls: ['messenger.page.scss'],
})
export class MessengerPage implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  receiverId: string = '';
  private firestore;
  private user: string = 'you'; 

  constructor(
    private cdr: ChangeDetectorRef,
    private afAuth: AngularFireAuth
  ) {
    const app = initializeApp(firebaseConfig.firebase);
    this.firestore = getFirestore(app);

    const messagesCollection = collection(this.firestore, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));

    // Listen for new messages in the Firestore collection
    
    // Call after updating messages
    /*onSnapshot(messagesQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          this.messages.push({
            id: change.doc.id,
            ...change.doc.data(),
          });
        }
      });
      this.cdr.detectChanges();
      this.scrollToBottom();
    });*/
  }

  scrollToBottom() {
    const chatContainer = document.querySelector('.chat');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  } 

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        //const chatId = this.getChatId(user.uid); // Current chat user ID
        const messagesCollection = collection(this.firestore, `chats/messages`);
        const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));
  
        onSnapshot(messagesQuery, (snapshot) => {
          this.messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.cdr.detectChanges();
          this.scrollToBottom();
        });
      }
    });
  }
  

  // Used to track the ID of messages for efficient rendering
  trackById(index: number, message: any): string | null {
    return message.id || null;
  }

  // Send a new message
  async sendMessage(receiverId: string) {
    if (this.newMessage.trim() !== '') {
      try {
        const user = await this.afAuth.currentUser;
        if (!user) throw new Error('User not authenticated');
  
        const chatId = this.getChatId(user.uid, receiverId);
        const messagesCollection = collection(this.firestore, `chats/${chatId}/messages`);
  
        const newMessage = {
          senderId: user.uid,
          receiverId: receiverId,
          text: this.newMessage,
          timestamp: new Date().toISOString(),
        };
  
        await addDoc(messagesCollection, newMessage);
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  getChatId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }
  

  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Logged in:', userCredential.user?.email);
    } catch (error) {
      console.error('Login error:', error);
    }
  }
  
  async logout() {
    await this.afAuth.signOut();
  }
  
  async getCurrentUser() {
    const user = await this.afAuth.currentUser;
    return user;
  }
}
