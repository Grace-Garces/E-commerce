using System;

namespace ProductService.Application.Exceptions;

public class DuplicateProductCodeException : Exception
{
    public DuplicateProductCodeException(string code)
        : base($"Já existe um produto com o código '{code}'.")
    {
    }
}
