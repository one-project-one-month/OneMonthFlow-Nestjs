enum EnumRespType {
  Success = "Success",
  ValidationError = "Validation Error",
  SystemError = "System Error",
  NotFoundError = "Not Found Error"
}

export class ResultService<T> {
  public IsSuccess: boolean;
  public get IsError(): boolean {
    return !this.IsSuccess;
  }
  public Message: string;
  public RespData: T | null;
  public Type: EnumRespType;
  public StatusCode: number;

  public get isValidationError(): boolean {
    return this.Type === EnumRespType.ValidationError;
  }

  public get isSystemError(): boolean {
    return this.Type === EnumRespType.SystemError;
  }

  public constructor(
    IsSuccess: boolean,
    Message: string,
    Type: EnumRespType,
    RespData: T | null,
    StatusCode: number,
  ) {
    this.IsSuccess = IsSuccess;
    this.Message = Message;
    this.Type = Type;
    this.RespData = RespData;
    this.StatusCode = StatusCode;
  }

  public static Success<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
  ): ResultService<T> {
    return new ResultService<T>(
      true,
      message,
      EnumRespType.Success,
      data,
      statusCode,
    );
  }

  public static ValidationError<T>(
    message: string,

    statusCode: number,
  ): ResultService<T> {
    return new ResultService<T>(
      false,
      message,
      EnumRespType.ValidationError,
      null,
      statusCode,
    );
  }

  public static SystemError<T>(
    message: string,
    statusCode: number,
  ): ResultService<T> {
    return new ResultService<T>(
      false,
      message,
      EnumRespType.SystemError,
      null,
      statusCode,
    );
  }

  public static NotFoundError<T>(
    message: string,
    statusCode: number,
  ): ResultService<T> {
    return new ResultService<T>(
      false,
      message,
      EnumRespType.NotFoundError,
      null,
      statusCode,
    );
  }

  public static LogoutSuccess<T>(
    message: string,
    statusCode: number,
  ): ResultService<T> {
    return new ResultService<T>(
      true,
      message,
      EnumRespType.Success,
      null,
      statusCode,
    );
  }
}
