import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Poll } from '../models/poll.model';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  constructor(private http: HttpClient) {}

  readMany(params: { proposalId: number }) {
    return this.http.get<Poll[]>(`${environment.apiUrl}/polls`, { params });
  }

  createOrUpdateOneInterestVote(params: {
    proposalId: number;
    id: number;
    myInterestVote: boolean | null;
  }) {
    return this.http.put<Poll>(
      `${environment.apiUrl}/polls/${params.id}/interest-votes`,
      params,
    );
  }
}
