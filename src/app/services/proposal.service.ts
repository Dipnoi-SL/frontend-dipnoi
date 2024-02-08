import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proposal } from '../models/proposal.model';
import { environment } from '../../environments/environment';
import { Page } from '../models/page.model';
import {
  OrderEnum,
  ProposalCategoryEnum,
  ProposalOrderByEnum,
  ProposalStateEnum,
} from '../constants/enums';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  constructor(private http: HttpClient) {}

  readMany(params: {
    take?: number;
    page?: number;
    orderBy?: ProposalOrderByEnum;
    order?: OrderEnum;
    states?: ProposalStateEnum[];
    search?: string;
    createdAt?: string;
    resetAt?: string;
    userId?: number;
  }) {
    return this.http.get<Page<Proposal>>(`${environment.apiUrl}/proposals`, {
      params,
    });
  }

  createOne(params: {
    initialTitle: string;
    initialDescription: string;
    categories: ProposalCategoryEnum[];
    pollLabels: string[];
  }) {
    return this.http.post<Proposal>(`${environment.apiUrl}/proposals`, params);
  }

  readOne(params: { id: number }) {
    return this.http.get<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}`,
    );
  }

  createOrUpdateOneThumbnail(params: { id: number; thumbnail: File }) {
    const formData = new FormData();

    formData.append('file', params.thumbnail, params.thumbnail.name);

    return this.http.put<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/thumbnail`,
      formData,
    );
  }

  createOneFollow(params: { id: number }) {
    return this.http.post<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/follows`,
      {},
    );
  }

  deleteOneFollow(params: { id: number }) {
    return this.http.delete<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/follows`,
    );
  }

  createOrUpdateOneSpecification(params: {
    id: number;
    finalTitle: string;
    finalDescription: string;
  }) {
    return this.http.put<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/specifications`,
      params,
    );
  }

  createOrUpdateOneReview(params: {
    id: number;
    state: ProposalStateEnum;
    cost?: number;
    disregardingReason?: string;
  }) {
    return this.http.put<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/reviews`,
      params,
    );
  }

  createOneTransition(params: { id: number; state: ProposalStateEnum }) {
    return this.http.post<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/transitions`,
      params,
    );
  }

  createOrUpdateOneImportanceVote(params: {
    id: number;
    myImportanceVote: number | null;
  }) {
    return this.http.put<Proposal>(
      `${environment.apiUrl}/proposals/${params.id}/importance-votes`,
      params,
    );
  }
}
