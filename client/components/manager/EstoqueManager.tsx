import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Filter,
} from "lucide-react";
import { ItemEstoque, MovimentacaoEstoque } from "@shared/manager-types";
import ManagerDataService from "@/services/managerData";
import { cn } from "@/lib/utils";

export function EstoqueManager() {
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [estoqueData, movData] = await Promise.all([
          ManagerDataService.getEstoque(),
          ManagerDataService.getMovimentacoes(),
        ]);
        setEstoque(estoqueData);
        setMovimentacoes(movData);
      } catch (error) {
        console.error("Erro ao carregar estoque:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredEstoque = estoque.filter((item) => {
    const matchSearch = item.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategoria =
      categoriaFilter === "all" || item.categoria === categoriaFilter;
    return matchSearch && matchCategoria;
  });

  const alertasEstoque = estoque.filter(
    (item) => item.quantidade <= item.quantidadeMinima,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Controle de Estoque</h2>
          <p className="text-muted-foreground">
            Gerencie materiais, medicamentos e equipamentos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <Tabs defaultValue="estoque" className="space-y-6">
        <TabsList>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="estoque" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Itens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estoque.length}</div>
                <p className="text-xs text-muted-foreground">Cadastrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {estoque.filter((i) => i.categoria === "medicamento").length}
                </div>
                <p className="text-xs text-muted-foreground">Em estoque</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Materiais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {estoque.filter((i) => i.categoria === "material").length}
                </div>
                <p className="text-xs text-muted-foreground">Disponíveis</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {alertasEstoque.length}
                </div>
                <p className="text-xs text-muted-foreground">Estoque baixo</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome do item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={categoriaFilter}
                  onValueChange={setCategoriaFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="medicamento">Medicamentos</SelectItem>
                    <SelectItem value="material">Materiais</SelectItem>
                    <SelectItem value="equipamento">Equipamentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Estoque Table */}
          <Card>
            <CardHeader>
              <CardTitle>Itens em Estoque ({filteredEstoque.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstoque.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="capitalize">
                        {item.categoria}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-medium",
                            item.quantidade <= item.quantidadeMinima
                              ? "text-red-600"
                              : "text-green-600",
                          )}
                        >
                          {item.quantidade}
                        </span>
                      </TableCell>
                      <TableCell>{item.quantidadeMinima}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell>
                        R${" "}
                        {item.valorUnitario.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>{item.fornecedor}</TableCell>
                      <TableCell>
                        {item.quantidade <= item.quantidadeMinima ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Baixo
                          </Badge>
                        ) : (
                          <Badge variant="outline">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimentacoes">
          <Card>
            <CardHeader>
              <CardTitle>Movimentações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Motivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoes.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="font-medium">
                        {mov.itemNome}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            mov.tipo === "entrada" ? "outline" : "secondary"
                          }
                        >
                          {mov.tipo === "entrada" ? (
                            <>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Entrada
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Saída
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{mov.quantidade}</TableCell>
                      <TableCell>{mov.responsavel}</TableCell>
                      <TableCell>
                        {new Date(mov.data).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>{mov.motivo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Alertas de Estoque Baixo</span>
              </CardTitle>
              <CardDescription>
                {alertasEstoque.length} item(ns) com estoque abaixo do mínimo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertasEstoque.map((item) => (
                  <div
                    key={item.id}
                    className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-red-900 dark:text-red-100">
                          {item.nome}
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Estoque atual: {item.quantidade} {item.unidade} |
                          Mínimo: {item.quantidadeMinima} {item.unidade}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Reabastecer
                      </Button>
                    </div>
                  </div>
                ))}
                {alertasEstoque.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum alerta de estoque no momento
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
