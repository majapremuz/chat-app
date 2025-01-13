import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { firebaseConfig } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-messenger',
  templateUrl: 'messenger.page.html',
  styleUrls: ['messenger.page.scss'],
})
export class MessengerPage implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  private firestore;

  constructor(private cdr: ChangeDetectorRef) {
    const app = initializeApp(firebaseConfig.firebase);
    this.firestore = getFirestore(app);

    const messagesCollection = collection(this.firestore, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));

    onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

       // Append new messages to the existing messages array
      this.messages = [...this.messages, ...newMessages];
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {}

  trackById(index: number, message: any): string | null {
    return message.id || null;
  }
  

  async sendMessage() {
    if (this.newMessage.trim() !== '') {
      try {
        const messagesCollection = collection(this.firestore, 'messages');
        const newMessage = {
          sender: 'you',
          text: this.newMessage,
          timestamp: new Date().toISOString(),
        };
        // Add new message to Firestore
        await addDoc(messagesCollection, newMessage);
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }
}
