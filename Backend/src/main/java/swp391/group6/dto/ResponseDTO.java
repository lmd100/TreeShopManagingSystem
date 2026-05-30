package swp391.group6.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO<T> implements Serializable {
    private int code;
    private String message;
    private T data;

    public ResponseDTO(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
