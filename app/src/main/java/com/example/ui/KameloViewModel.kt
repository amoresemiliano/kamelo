package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.MockData
import com.example.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.Locale

data class KameloUiState(
    val currentTab: NavigationTab = NavigationTab.INICIO,
    
    // Laboratorio
    val formulas: List<Formula> = MockData.initialFormulas,
    val selectedFormula: Formula? = MockData.initialFormulas.firstOrNull(),
    val productionQuantity: Int = 50,
    
    // Compras
    val plannedProduction: List<ProductionPlanItem> = MockData.initialPlannedProduction,
    val groupedRequirements: List<PurchaseRequirementGroup> = MockData.initialGroupedRequirements,
    val purchaseOrders: List<PurchaseOrder> = MockData.initialPurchaseOrders,
    val suppliers: List<SupplierInfo> = MockData.suppliers,
    val selectedComprasTab: Int = 0, // 0: Necesidades, 1: Órdenes, 2: Proveedores
    
    // Mercado
    val marketProducts: List<MarketProduct> = MockData.initialMarketProducts,
    val marketBenchmarks: List<MarketBenchmark> = MockData.marketBenchmarks,
    val isConsultingMarket: Boolean = false,
    val lastMarketUpdate: String = "hace 3 días",
    val marketCategoryFilter: String = "Todas",
    val marketSizeFilter: String = "Todos",
    val marketAromaFilter: String = "Todos",
    val marketLocationFilter: String = "Todas",
    val marketSourceFilter: String = "Todas",
    
    // Catálogo
    val catalogProducts: List<CatalogProduct> = MockData.catalogProducts,
    val selectedCatalogProduct: CatalogProduct? = MockData.catalogProducts.firstOrNull(),
    val catalogViewIsGrid: Boolean = true,
    val catalogCategoryFilter: String = "Todas",
    val catalogCollectionFilter: String = "Todas",
    val catalogAromaFilter: String = "Todos",
    
    // WhatsApp Dialog State
    val whatsAppProduct: CatalogProduct? = null,
    val whatsAppSize: String = "350 g",
    val whatsAppAroma: String = "Ámbar",
    val whatsAppClient: ClientMock = MockData.sampleClients.first(),
    
    // Dialogs & Toasts
    val showNewFormulaDialog: Boolean = false,
    val showNewProductDialog: Boolean = false,
    val toastMessage: String? = null
)

class KameloViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(KameloUiState())
    val uiState: StateFlow<KameloUiState> = _uiState.asStateFlow()

    fun selectTab(tab: NavigationTab) {
        _uiState.update { it.copy(currentTab = tab) }
    }

    fun selectComprasTab(index: Int) {
        _uiState.update { it.copy(selectedComprasTab = index) }
    }

    // --- LABORATORIO ACTIONS ---

    fun selectFormula(formula: Formula?) {
        _uiState.update { it.copy(selectedFormula = formula) }
    }

    fun setProductionQuantity(qty: Int) {
        val safeQty = if (qty < 1) 1 else qty
        _uiState.update { it.copy(productionQuantity = safeQty) }
    }

    fun submitProductionPlan(formula: Formula, qty: Int) {
        viewModelScope.launch {
            val newPlanItem = ProductionPlanItem(
                formulaId = formula.id,
                productName = formula.productName,
                variant = formula.variant,
                quantity = qty
            )

            // Calculate material requirements for this formula run
            val additionalReqs = mutableMapOf<String, MutableMap<Pair<String, String>, Double>>()
            // SupplierName -> (MaterialName, Unit) -> Quantity

            formula.ingredients.forEach { ing ->
                val totalAmountNeeded = ing.quantityPerUnit * qty
                val supplierMap = additionalReqs.getOrPut(ing.supplier) { mutableMapOf() }
                val key = Pair(ing.name, ing.unit)
                val current = supplierMap.getOrDefault(key, 0.0)
                supplierMap[key] = current + totalAmountNeeded
            }

            _uiState.update { state ->
                val updatedPlan = state.plannedProduction + newPlanItem

                // Merge into existing grouped requirements
                val currentGroupsMap = state.groupedRequirements.associateBy { it.supplierName }.toMutableMap()

                additionalReqs.forEach { (supplier, itemsMap) ->
                    val existingGroup = currentGroupsMap[supplier]
                    val existingItems = existingGroup?.requirements?.associateBy { Pair(it.materialName, it.unit) }?.toMutableMap() ?: mutableMapOf()

                    itemsMap.forEach { (matKey, amount) ->
                        val existingItem = existingItems[matKey]
                        if (existingItem != null) {
                            existingItems[matKey] = existingItem.copy(
                                totalQuantity = existingItem.totalQuantity + amount
                            )
                        } else {
                            existingItems[matKey] = PurchaseRequirementItem(
                                materialName = matKey.first,
                                totalQuantity = amount,
                                unit = matKey.second
                            )
                        }
                    }

                    currentGroupsMap[supplier] = PurchaseRequirementGroup(
                        supplierName = supplier,
                        requirements = existingItems.values.toList()
                    )
                }

                state.copy(
                    plannedProduction = updatedPlan,
                    groupedRequirements = currentGroupsMap.values.toList(),
                    toastMessage = "¡Producción de $qty u. de ${formula.productName} preparada! Requerimientos enviados a Compras."
                )
            }
        }
    }

    fun showNewFormulaDialog(show: Boolean) {
        _uiState.update { it.copy(showNewFormulaDialog = show) }
    }

    fun createFormula(
        name: String,
        variant: String,
        category: String,
        salePrice: Double
    ) {
        val newId = "f_${System.currentTimeMillis()}"
        val newFormula = Formula(
            id = newId,
            productName = name,
            variant = variant,
            category = category,
            estimatedCost = salePrice * 0.42, // estimated 42% cost structure
            lastUpdated = "Ahora",
            status = "Activa",
            yieldUnits = 1,
            defaultSalePrice = salePrice,
            ingredients = MockData.sampleIngredientsVelaAmbar200g
        )

        _uiState.update { state ->
            state.copy(
                formulas = listOf(newFormula) + state.formulas,
                selectedFormula = newFormula,
                showNewFormulaDialog = false,
                toastMessage = "Nueva fórmula \"$name $variant\" creada con éxito."
            )
        }
    }

    // --- COMPRAS ACTIONS ---

    fun createOrderForSupplier(group: PurchaseRequirementGroup) {
        val nextNum = _uiState.value.purchaseOrders.size + 1
        val orderId = "OC-2026-0$nextNum"
        val totalEst = group.requirements.sumOf { req ->
            val baseUnitCost = when (req.unit) {
                "kg" -> 22000.0
                "ml", "g" -> 140.0
                else -> 450.0
            }
            req.totalQuantity * baseUnitCost
        }

        val summary = group.requirements.take(3).joinToString(", ") { "${it.totalQuantity.toInt()} ${it.unit} ${it.materialName}" }

        val newOrder = PurchaseOrder(
            id = orderId,
            supplierName = group.supplierName,
            date = "Hoy",
            estimatedTotal = totalEst,
            status = OrderStatus.PENDIENTE,
            summary = summary
        )

        _uiState.update { state ->
            val newGroups = state.groupedRequirements.filter { it.supplierName != group.supplierName }
            state.copy(
                purchaseOrders = listOf(newOrder) + state.purchaseOrders,
                groupedRequirements = newGroups,
                selectedComprasTab = 1, // Switch to Órdenes tab
                toastMessage = "Orden $orderId generada para ${group.supplierName}."
            )
        }
    }

    // --- MERCADO ACTIONS ---

    fun consultMarket() {
        if (_uiState.value.isConsultingMarket) return

        viewModelScope.launch {
            _uiState.update { it.copy(isConsultingMarket = true) }
            delay(1600) // Simulate web query processing

            // Simulate slight dynamic update to showcase active market query
            val updatedList = _uiState.value.marketProducts.mapIndexed { idx, item ->
                if (idx == 1) {
                    item.copy(price = 22000.0, date = "Hace un momento")
                } else if (idx == 3) {
                    item.copy(promoPrice = 21900.0, date = "Hace un momento")
                } else {
                    item
                }
            }

            _uiState.update {
                it.copy(
                    isConsultingMarket = false,
                    lastMarketUpdate = "hace un momento",
                    marketProducts = updatedList,
                    toastMessage = "Consulta de mercado completada. 146 productos actualizados."
                )
            }
        }
    }

    fun setMarketCategoryFilter(category: String) {
        _uiState.update { it.copy(marketCategoryFilter = category) }
    }

    fun setMarketSizeFilter(size: String) {
        _uiState.update { it.copy(marketSizeFilter = size) }
    }

    fun setMarketAromaFilter(aroma: String) {
        _uiState.update { it.copy(marketAromaFilter = aroma) }
    }

    fun setMarketLocationFilter(loc: String) {
        _uiState.update { it.copy(marketLocationFilter = loc) }
    }

    fun setMarketSourceFilter(source: String) {
        _uiState.update { it.copy(marketSourceFilter = source) }
    }

    // --- CATÁLOGO ACTIONS ---

    fun setCatalogViewGrid(isGrid: Boolean) {
        _uiState.update { it.copy(catalogViewIsGrid = isGrid) }
    }

    fun selectCatalogProduct(product: CatalogProduct?) {
        _uiState.update { it.copy(selectedCatalogProduct = product) }
    }

    fun setCatalogCategoryFilter(cat: String) {
        _uiState.update { it.copy(catalogCategoryFilter = cat) }
    }

    fun setCatalogCollectionFilter(col: String) {
        _uiState.update { it.copy(catalogCollectionFilter = col) }
    }

    fun setCatalogAromaFilter(aroma: String) {
        _uiState.update { it.copy(catalogAromaFilter = aroma) }
    }

    fun openWhatsAppDialog(product: CatalogProduct) {
        _uiState.update {
            it.copy(
                whatsAppProduct = product,
                whatsAppSize = product.sizes.firstOrNull() ?: "350 g",
                whatsAppAroma = product.aromas.firstOrNull() ?: "Ámbar",
                whatsAppClient = MockData.sampleClients.first()
            )
        }
    }

    fun updateWhatsAppDetails(size: String? = null, aroma: String? = null, client: ClientMock? = null) {
        _uiState.update { state ->
            state.copy(
                whatsAppSize = size ?: state.whatsAppSize,
                whatsAppAroma = aroma ?: state.whatsAppAroma,
                whatsAppClient = client ?: state.whatsAppClient
            )
        }
    }

    fun closeWhatsAppDialog() {
        _uiState.update { it.copy(whatsAppProduct = null) }
    }

    fun showNewProductDialog(show: Boolean) {
        _uiState.update { it.copy(showNewProductDialog = show) }
    }

    fun createCatalogProduct(
        name: String,
        category: String,
        collection: String,
        description: String,
        price: Double
    ) {
        val newId = "cp_${System.currentTimeMillis()}"
        val newProduct = CatalogProduct(
            id = newId,
            imageUrl = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600",
            gallery = listOf("https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600"),
            name = name,
            shortDescription = description,
            fullDescription = description,
            category = category,
            collection = collection,
            startingPrice = price,
            status = "Activo",
            sizes = listOf("200 g", "350 g"),
            aromas = listOf("Vainilla", "Ámbar", "Lavanda"),
            sizePrices = mapOf("200 g" to price, "350 g" to (price * 1.5))
        )

        _uiState.update { state ->
            state.copy(
                catalogProducts = listOf(newProduct) + state.catalogProducts,
                selectedCatalogProduct = newProduct,
                showNewProductDialog = false,
                toastMessage = "Nuevo producto \"$name\" agregado al Catálogo."
            )
        }
    }

    fun clearToast() {
        _uiState.update { it.copy(toastMessage = null) }
    }

    companion object {
        fun formatArs(amount: Double): String {
            val formatter = NumberFormat.getCurrencyInstance(Locale("es", "AR"))
            formatter.maximumFractionDigits = 0
            val formatted = formatter.format(amount)
            return formatted.replace("ARS", "$").trim()
        }
    }
}
