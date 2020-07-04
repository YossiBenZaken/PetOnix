import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public items: Observable<any[]>;
  title = 'petOnix';
  constructor(private db: AngularFirestore) {
    this.items = db.collection('/posts').snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      });
    }));
  }
  like(id) {
    console.log(id);
    this.db.collection('/posts').doc(id).get().toPromise().then(doc => {
      const likes = doc.data().likes;
      likes.push({ name: 'Daniel Pasternak', userID: '111' });
      this.db.firestore.collection('/posts').doc(id).set({
        likes
      }, { merge: true });

    });
  }
}
