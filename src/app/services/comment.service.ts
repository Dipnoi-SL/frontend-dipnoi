import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Comment } from '../models/comment.model';
import { CommentOrderByEnum, OrderEnum } from '../constants/enums';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  readMany(params: {
    proposalId?: number;
    take?: number;
    page?: number;
    orderBy?: CommentOrderByEnum;
    order?: OrderEnum;
  }) {
    return this.http.get<Page<Comment>>(`${environment.apiUrl}/comments`, {
      params,
    });
  }

  createOne(params: { proposalId: number; body: string }) {
    return this.http.post<Comment>(`${environment.apiUrl}/comments`, params);
  }

  createOrUpdateOneFeedback(params: {
    id: number;
    myFeedback: boolean | null;
  }) {
    return this.http.put<Comment>(
      `${environment.apiUrl}/comments/${params.id}/feedbacks`,
      params,
    );
  }
}
