import UIKit
import WebKit

/// Hosts the bundled HTML5 game full-screen and bridges a few native niceties:
/// - `haptic`  : Taptic Engine feedback ("light", "medium", "heavy", "success", "error")
/// - `share`   : native share sheet with the generated score card image
final class GameViewController: UIViewController, WKScriptMessageHandler {
    private var webView: WKWebView!
    private let lightImpact = UIImpactFeedbackGenerator(style: .light)
    private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
    private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
    private let notification = UINotificationFeedbackGenerator()

    override func loadView() {
        let contentController = WKUserContentController()
        contentController.add(WeakScriptMessageHandler(self), name: "haptic")
        contentController.add(WeakScriptMessageHandler(self), name: "share")

        let config = WKWebViewConfiguration()
        config.userContentController = contentController
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0x05 / 255, green: 0x01 / 255, blue: 0x0F / 255, alpha: 1)
        webView.scrollView.backgroundColor = webView.backgroundColor
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsLinkPreview = false
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        guard let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web") else {
            assertionFailure("web/index.html missing from bundle")
            return
        }
        webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        [lightImpact, mediumImpact, heavyImpact].forEach { $0.prepare() }
    }

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        switch message.name {
        case "haptic":
            haptic(message.body as? String ?? "light")
        case "share":
            guard let body = message.body as? [String: Any] else { return }
            share(text: body["text"] as? String, imageDataURL: body["image"] as? String)
        default:
            break
        }
    }

    private func haptic(_ kind: String) {
        switch kind {
        case "medium": mediumImpact.impactOccurred()
        case "heavy": heavyImpact.impactOccurred()
        case "success": notification.notificationOccurred(.success)
        case "error": notification.notificationOccurred(.error)
        default: lightImpact.impactOccurred()
        }
    }

    private func share(text: String?, imageDataURL: String?) {
        var items: [Any] = []
        if let dataURL = imageDataURL,
           let comma = dataURL.firstIndex(of: ","),
           let data = Data(base64Encoded: String(dataURL[dataURL.index(after: comma)...])),
           let image = UIImage(data: data) {
            items.append(image)
        }
        if let text = text { items.append(text) }
        guard !items.isEmpty else { return }

        let sheet = UIActivityViewController(activityItems: items, applicationActivities: nil)
        if let popover = sheet.popoverPresentationController {
            popover.sourceView = view
            popover.sourceRect = CGRect(x: view.bounds.midX, y: view.bounds.maxY - 120, width: 1, height: 1)
            popover.permittedArrowDirections = []
        }
        present(sheet, animated: true)
    }
}

/// Avoids the retain cycle WKUserContentController creates with its handlers.
private final class WeakScriptMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?
    init(_ target: WKScriptMessageHandler) { self.target = target }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(userContentController, didReceive: message)
    }
}
