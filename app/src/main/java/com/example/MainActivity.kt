package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.NavigationTab
import com.example.ui.KameloViewModel
import com.example.ui.components.*
import com.example.ui.screens.*
import com.example.ui.theme.KameloLinen
import com.example.ui.theme.MyApplicationTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                KameloApp()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KameloApp(
    viewModel: KameloViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    val configuration = LocalConfiguration.current
    val isWideScreen = configuration.screenWidthDp >= 840

    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)

    // Handle toast messages
    LaunchedEffect(uiState.toastMessage) {
        uiState.toastMessage?.let { msg ->
            Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
            viewModel.clearToast()
        }
    }

    // Root Dialogs
    uiState.whatsAppProduct?.let { product ->
        WhatsAppModal(
            product = product,
            selectedSize = uiState.whatsAppSize,
            selectedAroma = uiState.whatsAppAroma,
            selectedClient = uiState.whatsAppClient,
            onUpdateSize = { viewModel.updateWhatsAppDetails(size = it) },
            onUpdateAroma = { viewModel.updateWhatsAppDetails(aroma = it) },
            onUpdateClient = { viewModel.updateWhatsAppDetails(client = it) },
            onDismiss = { viewModel.closeWhatsAppDialog() }
        )
    }

    if (uiState.showNewFormulaDialog) {
        NewFormulaDialog(
            onDismiss = { viewModel.showNewFormulaDialog(false) },
            onCreate = { name, variant, category, price ->
                viewModel.createFormula(name, variant, category, price)
            }
        )
    }

    if (uiState.showNewProductDialog) {
        NewProductDialog(
            onDismiss = { viewModel.showNewProductDialog(false) },
            onCreate = { name, category, collection, description, price ->
                viewModel.createCatalogProduct(name, category, collection, description, price)
            }
        )
    }

    if (isWideScreen) {
        // Desktop / Tablet Layout with persistent left sidebar
        Row(
            modifier = Modifier
                .fillMaxSize()
                .background(KameloLinen)
        ) {
            KameloSidebar(
                currentTab = uiState.currentTab,
                onTabSelected = { tab -> viewModel.selectTab(tab) }
            )

            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
            ) {
                KameloHeader(
                    currentTab = uiState.currentTab
                )

                Box(modifier = Modifier.weight(1f)) {
                    AnimatedContent(
                        targetState = uiState.currentTab,
                        transitionSpec = { fadeIn() togetherWith fadeOut() },
                        label = "MainContentTransition"
                    ) { targetTab ->
                        when (targetTab) {
                            NavigationTab.INICIO -> InicioScreen(
                                uiState = uiState,
                                onNavigateTab = { tab -> viewModel.selectTab(tab) },
                                onQuickNewFormula = { viewModel.showNewFormulaDialog(true) },
                                onQuickPrepareProduction = { viewModel.selectTab(NavigationTab.LABORATORIO) },
                                onQuickConsultMarket = { viewModel.selectTab(NavigationTab.MERCADO) },
                                onQuickNewProduct = { viewModel.showNewProductDialog(true) }
                            )

                            NavigationTab.LABORATORIO -> LaboratorioScreen(
                                uiState = uiState,
                                onSelectFormula = { formula -> viewModel.selectFormula(formula) },
                                onOpenNewFormulaDialog = { viewModel.showNewFormulaDialog(true) },
                                onSetQuantity = { qty -> viewModel.setProductionQuantity(qty) },
                                onSubmitProductionPlan = { formula, qty -> viewModel.submitProductionPlan(formula, qty) }
                            )

                            NavigationTab.COMPRAS -> ComprasScreen(
                                uiState = uiState,
                                onSelectComprasTab = { idx -> viewModel.selectComprasTab(idx) },
                                onCreateOrderForSupplier = { group -> viewModel.createOrderForSupplier(group) }
                            )

                            NavigationTab.MERCADO -> MercadoScreen(
                                uiState = uiState,
                                onConsultMarket = { viewModel.consultMarket() },
                                onCategoryFilterChange = { cat -> viewModel.setMarketCategoryFilter(cat) },
                                onSizeFilterChange = { sz -> viewModel.setMarketSizeFilter(sz) },
                                onAromaFilterChange = { ar -> viewModel.setMarketAromaFilter(ar) },
                                onLocationFilterChange = { loc -> viewModel.setMarketLocationFilter(loc) },
                                onSourceFilterChange = { src -> viewModel.setMarketSourceFilter(src) }
                            )

                            NavigationTab.CATALOGO -> CatalogoScreen(
                                uiState = uiState,
                                onSelectProduct = { prod -> viewModel.selectCatalogProduct(prod) },
                                onSetViewGrid = { isGrid -> viewModel.setCatalogViewGrid(isGrid) },
                                onOpenNewProductDialog = { viewModel.showNewProductDialog(true) },
                                onOpenWhatsAppShare = { prod -> viewModel.openWhatsAppDialog(prod) },
                                onCategoryFilterChange = { cat -> viewModel.setCatalogCategoryFilter(cat) },
                                onCollectionFilterChange = { col -> viewModel.setCatalogCollectionFilter(col) }
                            )
                        }
                    }
                }
            }
        }
    } else {
        // Mobile Layout with Navigation Drawer
        ModalNavigationDrawer(
            drawerState = drawerState,
            drawerContent = {
                ModalDrawerSheet {
                    KameloSidebar(
                        currentTab = uiState.currentTab,
                        onTabSelected = { tab ->
                            viewModel.selectTab(tab)
                            coroutineScope.launch { drawerState.close() }
                        }
                    )
                }
            }
        ) {
            Scaffold(
                topBar = {
                    KameloHeader(
                        currentTab = uiState.currentTab,
                        onOpenSidebarDrawer = {
                            coroutineScope.launch { drawerState.open() }
                        }
                    )
                },
                bottomBar = {
                    NavigationBar(containerColor = KameloLinen) {
                        NavigationTab.entries.forEach { tab ->
                            val isSelected = uiState.currentTab == tab
                            NavigationBarItem(
                                selected = isSelected,
                                onClick = { viewModel.selectTab(tab) },
                                icon = {
                                    Icon(
                                        imageVector = when (tab) {
                                            NavigationTab.INICIO -> androidx.compose.material.icons.Icons.Default.Home
                                            NavigationTab.LABORATORIO -> androidx.compose.material.icons.Icons.Default.Science
                                            NavigationTab.COMPRAS -> androidx.compose.material.icons.Icons.Default.ShoppingCart
                                            NavigationTab.MERCADO -> androidx.compose.material.icons.Icons.Default.Analytics
                                            NavigationTab.CATALOGO -> androidx.compose.material.icons.Icons.Default.GridView
                                        },
                                        contentDescription = tab.title
                                    )
                                },
                                label = { Text(tab.title, fontSize = 10.sp) }
                            )
                        }
                    }
                }
            ) { innerPadding ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(innerPadding)
                        .background(KameloLinen)
                ) {
                    when (uiState.currentTab) {
                        NavigationTab.INICIO -> InicioScreen(
                            uiState = uiState,
                            onNavigateTab = { tab -> viewModel.selectTab(tab) },
                            onQuickNewFormula = { viewModel.showNewFormulaDialog(true) },
                            onQuickPrepareProduction = { viewModel.selectTab(NavigationTab.LABORATORIO) },
                            onQuickConsultMarket = { viewModel.selectTab(NavigationTab.MERCADO) },
                            onQuickNewProduct = { viewModel.showNewProductDialog(true) }
                        )

                        NavigationTab.LABORATORIO -> LaboratorioScreen(
                            uiState = uiState,
                            onSelectFormula = { formula -> viewModel.selectFormula(formula) },
                            onOpenNewFormulaDialog = { viewModel.showNewFormulaDialog(true) },
                            onSetQuantity = { qty -> viewModel.setProductionQuantity(qty) },
                            onSubmitProductionPlan = { formula, qty -> viewModel.submitProductionPlan(formula, qty) }
                        )

                        NavigationTab.COMPRAS -> ComprasScreen(
                            uiState = uiState,
                            onSelectComprasTab = { idx -> viewModel.selectComprasTab(idx) },
                            onCreateOrderForSupplier = { group -> viewModel.createOrderForSupplier(group) }
                        )

                        NavigationTab.MERCADO -> MercadoScreen(
                            uiState = uiState,
                            onConsultMarket = { viewModel.consultMarket() },
                            onCategoryFilterChange = { cat -> viewModel.setMarketCategoryFilter(cat) },
                            onSizeFilterChange = { sz -> viewModel.setMarketSizeFilter(sz) },
                            onAromaFilterChange = { ar -> viewModel.setMarketAromaFilter(ar) },
                            onLocationFilterChange = { loc -> viewModel.setMarketLocationFilter(loc) },
                            onSourceFilterChange = { src -> viewModel.setMarketSourceFilter(src) }
                        )

                        NavigationTab.CATALOGO -> CatalogoScreen(
                            uiState = uiState,
                            onSelectProduct = { prod -> viewModel.selectCatalogProduct(prod) },
                            onSetViewGrid = { isGrid -> viewModel.setCatalogViewGrid(isGrid) },
                            onOpenNewProductDialog = { viewModel.showNewProductDialog(true) },
                            onOpenWhatsAppShare = { prod -> viewModel.openWhatsAppDialog(prod) },
                            onCategoryFilterChange = { cat -> viewModel.setCatalogCategoryFilter(cat) },
                            onCollectionFilterChange = { col -> viewModel.setCatalogCollectionFilter(col) }
                        )
                    }
                }
            }
        }
    }
}
