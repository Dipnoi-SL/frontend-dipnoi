export class TokenResponse {
  accessToken!: string;

  constructor(data: TokenResponse) {
    Object.assign(this, data);
  }
}
