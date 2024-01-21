export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum RoleEnum {
  USER = 'USER',
  DEVELOPER = 'DEVELOPER',
}

export enum ProposalStateEnum {
  INITIAL_PHASE = 'INITIAL_PHASE',
  PENDING_SPECIFICATION = 'PENDING_SPECIFICATION',
  PENDING_REVIEW = 'PENDING_REVIEW',
  FINAL_PHASE = 'FINAL_PHASE',
  COMPLETED = 'COMPLETED',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  SELECTED_FOR_DEVELOPMENT = 'SELECTED_FOR_DEVELOPMENT',
  NOT_VIABLE = 'NOT_VIABLE',
  NOT_BACKED = 'NOT_BACKED',
}

export enum ProposalCategoryEnum {
  BUG = 'BUG',
  UI = 'UI',
  ALGORITHMICS = 'ALGORITHMICS',
}

export enum ProposalOrderByEnum {
  CREATED_AT = 'createdAt',
  POPULARITY = 'popularity',
  LAST_DAY_POPULARITY = 'lastDayPopularity',
  COST = 'cost',
  IMPORTANCE = 'importance',
  PRIORITY = 'priority',
}
