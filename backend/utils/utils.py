import json

def create_hierarchical_json(lines, max_depth=10, prune_threshold=2.0):
    root = {'name': 'root', 'samples': 0, 'children': {}}

    for line in lines:
        parts = line.strip().split(' ')
        stack, samples = ' '.join(parts[:-1]), int(parts[-1])
        frames = stack.split(';')
        current = root
        for depth, frame in enumerate(frames):
            if depth < max_depth:
                if frame not in current['children']:
                    current['children'][frame] = {'name': frame, 'samples': 0, 'children': {}}
                current = current['children'][frame]
            else:
                # Once max_depth is reached, aggregate all deeper frames into a single "deep stack" node
                if 'deep stack' not in current['children']:
                    current['children']['deep stack'] = {'name': 'deep stack', 'samples': 0, 'children': {}}
                current['children']['deep stack']['samples'] += samples
                break  # Stop processing further frames for this stack
            current['samples'] += samples
        root['samples'] += samples  # Aggregate total samples at root level

    def prune_small_branches(node, total_samples):
        to_prune = []
        for name, child in node['children'].items():
            prune_small_branches(child, total_samples)  # Recursively prune children
            child['cpuShare'] = (child['samples'] / total_samples) * 100
            if child['cpuShare'] < prune_threshold and name != 'deep stack':
                to_prune.append(name)
        for name in to_prune:
            if 'other' not in node['children']:
                node['children']['other'] = {'name': 'other', 'samples': 0, 'children': {}}
            node['children']['other']['samples'] += node['children'][name]['samples']
            del node['children'][name]

    prune_small_branches(root, root['samples'])

    def dict_to_list(node):
        if 'children' in node:
            node['children'] = [dict_to_list(child) for child in node['children'].values()]
        return node

    return dict_to_list(root)

def extract_in_depth_top_consumers(node, depth=0, parent_share=100.0):
    """
    Extract and provide in-depth information on CPU share consumers from the flame graph data,
    focusing on identifying potential root causes within deep stack levels.
    """
    # Update the path with current node, and calculate its relative CPU share
    current_share = node.get('cpuShare', parent_share)  # Default to parent share if not specified
    details = {
        'name': node['name'],
        'share': current_share,
        'depth': depth,
        'children': []
    }
    
    # Process children if they exist, and sort them by their CPU share
    if 'children' in node:
        sorted_children = sorted(node['children'], key=lambda x: x.get('cpuShare', 0), reverse=True)
        for child in sorted_children:
            # Recurse into children, increasing depth
            child_details = extract_in_depth_top_consumers(child, depth + 1, current_share)
            details['children'].append(child_details)
    
    return details

def format_detailed_summary(top_details, top_n=3):
    """
    Format the detailed information for the top CPU share consumers for display.
    """
    def format_node_details(node, prefix=''):
        formatted = f"{prefix}{node['name']} ({node['share']:.2f}%)\n"
        if node['children']:
            # Consider showing more details for significant children or based on depth
            for child in node['children'][:top_n]:  # Limit to top N children for readability
                formatted += format_node_details(child, prefix + '  ')  # Indent for hierarchy
        return formatted

    # Format the top N details
    formatted_summary = []
    for i, details in enumerate(top_details[:top_n]):  # Ensure only top N processes
        formatted_summary.append(f"{i + 1}. {format_node_details(details)}")
    
    return "\n".join(formatted_summary)