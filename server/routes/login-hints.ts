import { RequestHandler } from "express";
import { getLoginHints } from "../user-types";

export const getLoginHintsHandler: RequestHandler = async (req, res) => {
  try {
    const hints = getLoginHints();
    
    res.json({
      success: true,
      data: hints,
      message: "Dados de login para teste obtidos com sucesso"
    });

  } catch (error) {
    console.error("Error getting login hints:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};
