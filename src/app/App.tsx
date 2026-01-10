import { NotificationPanelContextProvider } from '@/app/(control-panel)/apps/notifications/contexts/NotificationPanelContext/NotificationPanelContextProvider';
import { NavbarContextProvider } from '@/components/theme-layouts/components/navbar/contexts/NavbarContext/NavbarContextProvider';
import { NavigationContextProvider } from '@/components/theme-layouts/components/navigation/contexts/NavigationContextProvider';
import { QuickPanelProvider } from '@/components/theme-layouts/components/quickPanel/contexts/QuickPanelContext/QuickPanelContextProvider';
import routes from '@/configs/routesConfig';
import AppContext from '@/contexts/AppContext';
import GlobalContextProvider from '@/contexts/GlobalContext/GlobalContextProvider';
import RootThemeProvider from '@/contexts/RootThemeProvider';
import Authentication from '@auth/Authentication';
import { FuseDialogContextProvider } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/FuseDialogContextProvider';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseSettingsProvider from '@fuse/core/FuseSettings/FuseSettingsProvider';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import { I18nProvider } from '@i18n/I18nProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { enUS } from 'date-fns/locale/en-US';
import { SnackbarProvider } from 'notistack';
import themeLayouts from 'src/components/theme-layouts/themeLayouts';
import MainThemeProvider from '../contexts/MainThemeProvider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: 1
		}
	}
});

/**
 * The main App component.
 */
function App() {
	const AppContextValue = {
		routes
	};

	return (
		<ErrorBoundary>
			<AppContext value={AppContextValue}>
				{/* Date Picker Localization Provider */}
				<GlobalContextProvider>
					<LocalizationProvider
						dateAdapter={AdapterDateFns}
						adapterLocale={enUS}
					>
						<QueryClientProvider client={queryClient}>
							<Authentication>
								<FuseSettingsProvider>
									<I18nProvider>
										{/* Theme Provider */}
										<RootThemeProvider>
											<MainThemeProvider>
												<NavbarContextProvider>
													<NavigationContextProvider>
														<FuseDialogContextProvider>
															{/* Notistack Notification Provider */}
															<SnackbarProvider
																maxSnack={5}
																anchorOrigin={{
																	vertical: 'bottom',
																	horizontal: 'right'
																}}
																classes={{
																	containerRoot:
																		'bottom-0 right-0 mb-13 md:mb-17 mr-2 lg:mr-20'
																}}
															>
																<NotificationPanelContextProvider>
																	<QuickPanelProvider>
																		<FuseLayout layouts={themeLayouts} />
																	</QuickPanelProvider>
																</NotificationPanelContextProvider>
															</SnackbarProvider>
														</FuseDialogContextProvider>
													</NavigationContextProvider>
												</NavbarContextProvider>
											</MainThemeProvider>
										</RootThemeProvider>
									</I18nProvider>
								</FuseSettingsProvider>
							</Authentication>
							<ReactQueryDevtools initialIsOpen={false} />
						</QueryClientProvider>
					</LocalizationProvider>
				</GlobalContextProvider>
			</AppContext>
		</ErrorBoundary>
	);
}

export default App;
